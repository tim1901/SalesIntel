import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const handler = async (event) => {
  const { company } = JSON.parse(event.body);

  try {
    // Run just ONE simple research call + contact extraction
    const [basicResearch, executiveContacts] = 
      await Promise.all([
        runResearch(`Quick research on ${company}: What is the company? Who are the key executives and their titles? What are they hiring for? Return as JSON.`),
        extractExecutiveContacts(company)
      ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        company,
        companyIntel: basicResearch,
        jobPostings: basicResearch,
        industryTrends: basicResearch,
        socialSignals: basicResearch,
        execResearch: basicResearch,
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
      max_tokens: 800,
      tools: [{ type: "web_search_20260209", name: "web_search", allowed_callers: ["direct"] }],
      messages: [{ role: "user", content: query }],
    });

    let result = "";
    for (const block of response.content) {
      if (block.type === "text") {
        result += block.text + "\n";
      } else if (block.type === "tool_result") {
        result += block.content + "\n";
      }
    }
    return result;
  } catch (error) {
    console.error("Research error:", error);
    return JSON.stringify({ error: error.message });
  }
}

async function extractExecutiveContacts(company) {
  try {
    const searchPrompts = [
      `Find CEO, CTO, VP Engineering, VP Sales emails and LinkedIn for ${company}. Return JSON with: name, title, email, linkedin.`,
    ];

    const contacts = [];

    for (const prompt of searchPrompts) {
      try {
        const response = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          tools: [{ type: "web_search_20260209", name: "web_search", allowed_callers: ["direct"] }],
          messages: [{ role: "user", content: prompt }],
        });

        let text = "";
        for (const block of response.content) {
          if (block.type === "text") {
            text += block.text + "\n";
          } else if (block.type === "tool_result") {
            text += block.content + "\n";
          }
        }

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
