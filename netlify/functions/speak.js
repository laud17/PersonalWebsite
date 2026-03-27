const https = require("https");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const { text } = JSON.parse(event.body);

  // Strip emojis and special characters before sending to TTS
  const cleaned = text
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[*_~`#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const body = JSON.stringify({
    model: "tts-1-hd",
    input: cleaned,
    voice: "nova",      // warm, friendly, great for kids
    speed: 0.92         // slightly slower for kids
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: "api.openai.com",
      path: "/v1/audio/speech",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Length": Buffer.byteLength(body)
      }
    }, (res) => {
      const chunks = [];
      res.on("data", chunk => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: 200,
          headers: { "Content-Type": "audio/mpeg" },
          body: buffer.toString("base64"),
          isBase64Encoded: true
        });
      });
    });
    req.on("error", e => resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) }));
    req.write(body);
    req.end();
  });
};
