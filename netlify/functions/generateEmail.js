import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const handler = async (event) => {
  const { synthesis, name, service, contactName, contactTitle, targetEmail } = JSON.parse(event.body);

  try {
    const prompt = `
You are a 25-year veteran business development executive.

COMPANY: ${synthesis.company}
TARGET: ${contactName} (${contactTitle})
EMAIL: ${targetEmail || "Unknown"}

ANALYSIS:
Pain points: ${synthesis.pain_points.join(", ")}
Opportunities: ${synthesis.opportunities.join(", ")}
Sentiment: ${synthesis.executive_sentiment}

SERVICE: "${service}"
YOUR NAME: ${name}

Write a cold email that:
1. Opens with a specific insight from research
2. Shows you understand their world
3. Connect to their pain point
4. Introduce your service as THE solution
5. End with low-friction 15-min call CTA
6. Sign with your name

PERSONALIZE BY ROLE:
- CTO/VP Engineering: technical challenges, scaling, hiring
- VP Product/Growth: growth, velocity, retention
- VP Sales: pipeline, revenue, new markets
- CEO: strategic impact, company growth

Keep under 200 words. Sound like a real person.

Write ONLY the email:
---
Subject: [hook]

Hi ${contactName},

[body]

Best,
${name}
---
`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const email = response.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        email,
        recipient: { name: contactName, title: contactTitle, email: targetEmail }
      }),
    };
  } catch (error) {
    console.error("Email generation error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
