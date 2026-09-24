// Netlify function: proxies Teacher Leader Scheduler requests to the Anthropic Messages API.
// Requires ANTHROPIC_API_KEY in Netlify environment variables (already set for the other demos).
// Optional: TLS_MODEL to override the model.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const reply = (statusCode, obj) => ({
  statusCode,
  headers: { ...CORS, 'Content-Type': 'application/json' },
  body: JSON.stringify(obj),
});

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return reply(405, { error: { message: 'Method not allowed' } });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return reply(500, { error: { message: 'API key not configured on server' } });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return reply(400, { error: { message: 'Invalid JSON in request body' } }); }
  if (!Array.isArray(body.messages) || !body.messages.length) {
    return reply(400, { error: { message: 'messages array is required' } });
  }

  const payload = {
    model: process.env.TLS_MODEL || 'claude-sonnet-5',
    max_tokens: Math.min(Number(body.max_tokens) || 2000, 4000),
    messages: body.messages,
  };
  if (typeof body.system === 'string' && body.system) payload.system = body.system;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return reply(res.status, data);
  } catch (err) {
    return reply(502, { error: { message: 'Upstream request failed: ' + err.message } });
  }
};
