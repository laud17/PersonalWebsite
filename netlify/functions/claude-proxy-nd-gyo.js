// Claude API proxy for the North Dakota GYO Design Lab (/nd-gyo/).
// The API key lives only in Netlify: Site configuration → Environment variables → ANTHROPIC_API_KEY.

const MODEL = process.env.ND_GYO_MODEL || "claude-sonnet-5-5";
const MAX_MESSAGES = 20;        // keep the last N turns
const MAX_CHARS = 8000;         // per message
const PROFILE_FIELD_CHARS = 300;

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

const reply = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

const clean = (v, max) => String(v ?? "").slice(0, max).trim();

function systemPrompt(p) {
  const line = (label, v) => `- ${label}: ${clean(v, PROFILE_FIELD_CHARS) || "Not provided"}`;
  return `You are the AI design coach for the "Grow Your Own Design Lab," a workshop companion from a November 20, 2026 presentation by Lennon Audrain, PhD (Arizona State University, Next Education Workforce) for North Dakota school district teams.

Your job: help district teams design Grow Your Own (GYO) educator pathways using six plays.
Teacher academies:
1. Deploy teacher academy students in role-based field experiences (literacy tutors, math tutors, student success coaches, instructional interns).
2. Stack credentials before high school graduation (Teaching Professional coursework, Educational Methodology, dual credit, supervised work, general education para certificate).
3. Create a district employment offer at graduation (priority interviews, paid summer work, preparation partners, credit transfer, mentorship).
Registered apprenticeships:
4. Identify multiple entry points into teaching (academy graduates, paraprofessionals, substitutes, parents, career changers, other employees).
5. Design the apprentice role around developmental progression (foundations, instructional support, developing educator, clinical preparation, licensed teacher).
6. Embed apprentices within educator teams (shared rosters, distributed expertise, common planning, lead teacher mentoring; teacher apprentice, lead teacher apprentice, journeyworker).

District profile:
${line("District", p.district)}
${line("Community / county", p.location)}
${line("Geographic context", p.geography)}
${line("Approximate enrollment", p.enrollment)}
${line("Existing programs", p.assets)}
${line("Greatest workforce challenge", p.challenge)}
${line("Known partners / travel constraints", p.partners)}

Guidelines:
- Tailor advice to this district's size, geography and challenges, especially rural distance, small staffs and shared regional resources.
- Be concrete and practical: roles, schedules, supervision, timelines, owners. Prefer short sections and lists.
- You cannot browse the web. Present any specific North Dakota program, credential, funding source, rule or partner as something to verify with ND DPI, ESPB, Job Service ND, the U.S. Department of Labor apprenticeship office or the partner itself. Never invent statistics, dollar amounts or legal requirements.
- Academy students support learning under supervision; they never replace licensed teachers.
- Do not ask for or repeat personally identifying information about students or staff.
- Keep answers under about 450 words unless asked for more.`;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };
  if (event.httpMethod !== "POST") return reply(405, { error: "Method not allowed" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return reply(500, { error: "Server is missing ANTHROPIC_API_KEY" });

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return reply(400, { error: "Invalid request" });
  }

  const profile = body.profile && typeof body.profile === "object" ? body.profile : {};
  let messages = Array.isArray(body.messages) ? body.messages : [];
  messages = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: clean(m.content, MAX_CHARS) }))
    .slice(-MAX_MESSAGES);
  // The API needs the conversation to start with a user turn and end with one.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return reply(400, { error: "Please ask a question" });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        system: systemPrompt(profile),
        messages,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("Anthropic error", r.status, JSON.stringify(data));
      const msg = r.status === 429 || r.status === 529
        ? "The AI coach is busy right now. Please try again in a moment"
        : "The AI coach could not respond";
      return reply(502, { error: msg });
    }
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    if (!text) return reply(502, { error: "The AI coach returned an empty response" });
    return reply(200, { reply: text });
  } catch (e) {
    console.error("Proxy failure", e);
    return reply(502, { error: "Could not reach the AI service" });
  }
};
