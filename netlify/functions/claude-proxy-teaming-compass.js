// Netlify Function: proxies chat requests to the Anthropic API so the
// real API key never reaches the browser. Set ANTHROPIC_API_KEY (and
// optionally ANTHROPIC_MODEL) in Netlify's Site settings > Environment variables.

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY is not set in this Netlify site's environment variables." }),
    };
  }

  try {
    const { system, prompt, maxTokens } = JSON.parse(event.body || "{}");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: maxTokens || 1000,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    return { statusCode: res.status, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
}
