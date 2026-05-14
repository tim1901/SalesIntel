import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const handler = async (event) => {
  const { research } = JSON.parse(event.body);

  try {
    const prompt = `
You are an expert business intelligence analyst. Synthesize this research on ${research.company}:

COMPANY INTEL: ${research.companyIntel}
JOB POSTINGS: ${research.jobPostings}
INDUSTRY TRENDS: ${research.industryTrends}
SOCIAL SIGNALS: ${research.socialSignals}
EXECUTIVE RESEARCH: ${research.execResearch}
EXECUTIVE CONTACTS: ${research.executiveContacts}

Identify:
1. Pain points
2. Timing signals
3. Opportunities
4. Executive sentiment
5. Rank executives by relevance

Return ONLY this JSON:
{
  "company": "${research.company}",
  "pain_points": ["pain1", "pain2"],
  "timing_signals": ["signal1", "signal2"],
  "opportunities": ["opp1", "opp2"],
  "executive_sentiment": "summary",
  "recommendation": "angle",
  "target_executives": [
    {"rank": 1, "name": "Name", "title": "Title", "email": "email@company.com", "linkedin": "url", "relevance_score": 9, "why_target": "reason", "outreach_readiness": "high"}
  ],
  "total_contacts_found": 5,
  "contacts_with_email": 3,
  "contacts_with_linkedin": 5
}
`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("No JSON found");

    const synthesis = JSON.parse(jsonMatch[0]);

    return {
      statusCode: 200,
      body: JSON.stringify(synthesis),
    };
  } catch (error) {
    console.error("Synthesis error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
