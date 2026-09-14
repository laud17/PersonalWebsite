// Serverless proxy for the APS Teaming Dashboard's "Ask about the data" feature.
// Keeps the Anthropic API key server-side (never exposed to the browser).
//
// Setup: in the Netlify site that serves this repo, add an environment
// variable named ANTHROPIC_API_KEY (Site settings -> Environment variables).

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let question, context;
  try {
    ({ question, context } = JSON.parse(event.body || "{}"));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  if (!question || typeof question !== "string") {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing question." }) };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured on this Netlify site." }) };
  }

  const systemPrompt = `You are a helpful analyst answering questions about a beginning-of-year (BOY) team-based staffing implementation heat map for Albuquerque Public Schools (APS).

Data (JSON, one entry per school with its teams and per-team scores across the six elements, in element order): ${JSON.stringify(context).slice(0, 14000)}

Scoring scale: 0 = Not yet evident, 1 = Beginning, 2 = Demonstrating, 3 = Deepening.
Elements measured, in order: Shared responsibility, Teammateship, Collaborative planning, Dynamic team teaching, Strength-based roles, Improvement and sustainability.

Answer using only this data. Be concise — a few sentences or a short list. Name specific schools/teams and scores when relevant. If the data doesn't support an answer, say so plainly rather than guessing.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Claude API error", detail }) };
    }

    const data = await response.json();
    const answer = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer: answer || "I couldn't generate an answer from that data." }),
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server error", detail: String(err) }) };
  }
};
