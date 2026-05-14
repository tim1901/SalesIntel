import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const handler = async (event) => {
  const { company } = JSON.parse(event.body);

  try {
    const basicResearch = await runResearch(`Quick research on ${company}: What is the company? Key executives and titles? Hiring for? Return JSON.`);
    
    await new Promise(r => setTimeout(r, 1500));
    
    const executiveContacts = await extractExecutiveContacts(company);

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
    console.error("Error:", error);
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
      max_tokens: 600,
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
    return JSON.stringify({ error: error.message });
  }
}

async function extractExecutiveContacts(company) {
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      tools: [{ type: "web_search_20260209", name: "web_search", allowed_callers: ["direct"] }],
      messages: [{ role: "user", content: `Find CEO, CTO, VP Eng, VP Sales emails and LinkedIn for ${company}. Return JSON: name, title, email, linkedin.` }],
    });

    let text = "";
    for (const block of response.content) {
      if (block.type === "text") {
        text += block.text;
      } else if (block.type === "tool_result") {
        text += block.content;
      }
    }

    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const contacts = [];
    
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

    const unique = deduplicateContacts(contacts);
    
    return JSON.stringify({
      executives: unique,
      total_found: unique.length,
    });
  } catch (error) {
    return JSON.stringify({ 
      error: error.message,
      executives: [],
    });
  }
}

function deduplicateContacts(contacts) {
  const seen = new Set();
  const unique = [];

  for (const c of contacts) {
    if (!c.name && !c.email && !c.linkedin) continue;
    const k = `${(c.name || "").toLowerCase()}-${(c.email || "").toLowerCase()}-${(c.linkedin || "").toLowerCase()}`;
    if (!seen.has(k)) {
      seen.add(k);
      const n = {
        name: c.name || "Unknown",
        title: c.title || "Not specified",
        email: c.email || null,
        linkedin: normalizeLinkedInUrl(c.linkedin),
      };
      if (n.email || n.linkedin) {
        unique.push(n);
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
