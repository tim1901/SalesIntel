import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const handler = async (event) => {
  const { company } = JSON.parse(event.body);

  try {
    const [companyIntel, jobPostings, industryTrends, socialSignals, execResearch, executiveContacts] = 
      await Promise.all([
        runResearch(`Research ${company}: Find their website, company size, industry, leadership, recent news. Return as JSON.`),
        runResearch(`Find ${company} job postings. What roles are they hiring? Return as JSON.`),
        runResearch(`Find industry trends relevant to ${company}'s sector. Market shifts, regulations. Return as JSON.`),
        runResearch(`Search social media about ${company}. What are people saying? Complaints, praise? Return as JSON.`),
        runResearch(`Research top executives at ${company}. What are they talking about? LinkedIn, podcasts, talks? Return as JSON.`),
        extractExecutiveContacts(company)
      ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        company,
        companyIntel,
        jobPostings,
        industryTrends,
        socialSignals,
        execResearch,
        executiveContacts,
      }),
    };
  } catch (error) {
    console.error("Research error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function runResearch(query) {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search", name: "web_search" }],
      messages: [{ role: "user", content: query }],
    });

    return response.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");
  } catch (error) {
    console.error("Research error:", error);
    return JSON.stringify({ error: error.message });
  }
}

async function extractExecutiveContacts(company) {
  try {
    const searchPrompts = [
      `Find email addresses and LinkedIn profiles for top executives at ${company}. CEO, CTO, VP Engineering, VP Product, VP Sales. Return as JSON.`,
      `Find contact information for decision makers at ${company}. Head of Engineering, VP of Technology. Return as JSON.`,
      `Search ${company} team member profiles on LinkedIn. Find CEO, founders, top executives. Return as JSON array.`,
      `Find emails for ${company} executives using common patterns. Return as JSON.`,
    ];

    const contacts = [];

    for (const prompt of searchPrompts) {
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          tools: [{ type: "web_search", name: "web_search" }],
          messages: [{ role: "user", content: prompt }],
        });

        const text = response.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");
        const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed)) {
              contacts.push(...parsed);
            } else {
              contacts.push(parsed);
            }
          } catch (e) {
            contacts.push({ raw: text });
          }
        }
      } catch (error) {
        console.error("Contact search error:", error);
      }
    }

    const uniqueContacts = deduplicateContacts(contacts);
    
    return JSON.stringify({
      executives: uniqueContacts,
      total_found: uniqueContacts.length,
      note: "Contacts found from research.",
    });
  } catch (error) {
    console.error("Contact extraction error:", error);
    return JSON.stringify({ 
      error: error.message,
      executives: [],
      note: "Failed to extract contacts."
    });
  }
}

function deduplicateContacts(contacts) {
  const seen = new Set();
  const unique = [];

  for (const contact of contacts) {
    if (!contact.name && !contact.email && !contact.linkedin) continue;

    const key = `${(contact.name || "").toLowerCase()}-${(contact.email || "").toLowerCase()}-${(contact.linkedin || "").toLowerCase()}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      
      const normalized = {
        name: contact.name || "Unknown",
        title: contact.title || "Not specified",
        email: contact.email || null,
        linkedin: normalizeLinkedInUrl(contact.linkedin),
        company: contact.company,
        confidence: contact.confidence || "medium",
      };

      if (normalized.email || normalized.linkedin) {
        unique.push(normalized);
      }
    }
  }

  return unique;
}

function normalizeLinkedInUrl(url) {
  if (!url) return null;
  if (!url.includes("linkedin.com")) {
    return `https://linkedin.com/in/${url.replace(/[^a-zA-Z0-9-]/g, "")}`;
  }
  return url.replace(/^http:/, "https:").replace(/\/$/, "");
}
