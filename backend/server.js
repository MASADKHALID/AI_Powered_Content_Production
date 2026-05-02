// ─────────────────────────────────────────────
//  ContentAI — Backend Server
//  Stack : Node.js + Express + Groq API (free)
//  Run   : node server.js
// ─────────────────────────────────────────────

const express = require("express");
const cors    = require("cors");
const fetch   = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ══════════════════════════════════════════════
//  Set the environment variable `GROQ_API_KEY` when running.
//  Get a free key at: https://console.groq.com/keys
// ══════════════════════════════════════════════
const GROQ_API_KEY = process.env.GROQ_API_KEY;
// ══════════════════════════════════════════════

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL   = "llama-3.3-70b-versatile"; // free, fast, powerful
const PORT         = 3001;

// ── Startup check ─────────────────────────────
if (!GROQ_API_KEY) {
  console.error("❌  No Groq API key found!\n    Set the GROQ_API_KEY environment variable before starting the server.");
  console.error("    Get a free key at: https://console.groq.com/keys");
  process.exit(1);
}

// ── Helper: call Groq ──────────────────────────
async function callGroq(systemPrompt, userPrompt) {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

// ── Safe JSON parse ────────────────────────────
function safeJSON(raw, fallback) {
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return fallback;
  }
}

// ── POST /api/generate ─────────────────────────
app.post("/api/generate", async (req, res) => {
  const { topic, niche, platform, duration, tone, characterDesc } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "topic is required" });
  }

  const charNote = characterDesc
    ? `\nCharacter reference: "${characterDesc}" — keep this character visually consistent across all scenes and prompts.`
    : "";

  try {

    // ── 1. Overall Script ──────────────────────
    const scriptRaw = await callGroq(
      `You are an expert short-form content scriptwriter for ${platform} in ${tone} tone. Niche: ${niche}.
Return ONLY valid JSON with keys: hook (1-2 punchy sentences), body (3-5 sentences), cta (1 sentence). No markdown.`,
      `Topic: "${topic}". Duration: ${duration}s. Niche: ${niche}. Platform: ${platform}.${charNote}`
    );
    const script = safeJSON(scriptRaw, {
      hook: scriptRaw.slice(0, 120),
      body: scriptRaw.slice(120, 400),
      cta: "Follow for more!",
    });

    // ── 2. Per-Scene Full Package ──────────────
    // Each scene gets: scene number, time, visual description,
    // voiceover line, scene script, image prompt, animation prompt
    const scenesRaw = await callGroq(
      `You are a video director AND scriptwriter AND AI prompt engineer specializing in ${niche} content for ${platform}.${charNote}
Return ONLY a valid JSON array of 5 scene objects. Each object must have ALL of these keys:
- scene: (number 1-5)
- time: (e.g. "0-8s", "8-18s" etc, covering total ${duration}s evenly)
- visual: (2 sentences — what the viewer SEES, in ${niche} style)
- voiceover: (exact words spoken during this scene, natural ${tone} tone, 1-3 sentences)
- sceneScript: (director note — camera angle, transitions, mood for this scene, 1-2 sentences)
- imagePrompt: (detailed AI image generation prompt for this scene in ${niche} style, 40-50 words, include "--ar 9:16")
- animationPrompt: (animation/motion instruction for this scene — what moves, how, speed, 1-2 sentences)
No markdown. Return ONLY the JSON array.`,
      `Topic: "${topic}". Overall script body: "${script.body}". Duration: ${duration}s total.${charNote}`
    );

    const scenes = safeJSON(scenesRaw, [
      {
        scene: 1, time: "0-10s",
        visual: `Opening ${niche} style shot of ${topic}`,
        voiceover: `Welcome to this amazing exploration of ${topic}.`,
        sceneScript: "Wide establishing shot, slow zoom in.",
        imagePrompt: `${niche} style, ${topic}, dramatic opening, cinematic lighting, 9:16 vertical --ar 9:16`,
        animationPrompt: "Slow zoom in from wide to medium, gentle camera drift left to right.",
      }
    ]);

    // ── 3. Thumbnail ───────────────────────────
    const thumbRaw = await callGroq(
      `You are a viral thumbnail designer for ${platform}.
Return ONLY valid JSON: { concept (2 sentences), textOverlay (max 6 words), colorScheme (2-3 colors), tip (1 sentence pro tip) }. No markdown.`,
      `Topic: "${topic}". Niche: ${niche}. Tone: ${tone}.${charNote}`
    );
    const thumbnail = safeJSON(thumbRaw, {
      concept: `High-contrast ${niche} style image of ${topic}`,
      textOverlay: topic.slice(0, 30).toUpperCase(),
      colorScheme: "Deep black, electric teal, white",
      tip: "Use bold contrasting text in the top third of the image.",
    });

    // ── 4. Animation & Video Tools ─────────────
    const animRaw = await callGroq(
      `You are a content automation expert for ${niche} videos on ${platform}.
Return ONLY a valid JSON array of 4 tool objects: {name, type (Free/Freemium/Paid), color (one of: accent, amber, coral, blue), description (1 sentence on how to use for this niche)}. Prioritize free tools. No markdown.`,
      `Niche: ${niche}. Platform: ${platform}. Topic: "${topic}".`
    );
    const tools = safeJSON(animRaw, [
      { name: "CapCut", type: "Free", color: "accent", description: "Add transitions and music to your scenes." },
    ]);

    // ── 5. SEO Package ─────────────────────────
    const seoRaw = await callGroq(
      `You are an SEO expert for ${platform} short-form video.
Return ONLY valid JSON: { title (under 60 chars, 1-2 emojis), tags (8-10 hashtags string), description (2-3 sentences), thumbnail_tip (1 sentence) }. No markdown.`,
      `Topic: "${topic}". Niche: ${niche}. Platform: ${platform}. Tone: ${tone}.`
    );
    const seo = safeJSON(seoRaw, {
      title: topic,
      tags: "#shorts #viral #content",
      description: "Amazing content about " + topic,
      thumbnail_tip: "Use bold text overlay on the key visual.",
    });

    // ── 6. Creator Tips ────────────────────────
    const tipsRaw = await callGroq(
      `You are an expert ${niche} content creator on ${platform}.
Return ONLY a valid JSON array of 5 short actionable tip strings (under 20 words each). No markdown.`,
      `Topic: "${topic}". Niche: ${niche}. Platform: ${platform}. Focus on free tools, workflow, and growth.`
    );
    const tips = safeJSON(tipsRaw, [
      "Post consistently at least 3 times per week for best growth.",
      "Use trending audio to boost initial reach.",
    ]);

    res.json({ script, scenes, thumbnail, tools, seo, tips });

  } catch (err) {
    res.status(500).json({ error: err.message || "Generation failed" });
  }
});

// ── Health check ───────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok", model: GROQ_MODEL }));

// ── Start ──────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  ContentAI backend running → http://localhost:${PORT}`);
  console.log(`    Model : ${GROQ_MODEL} (Groq free tier)`);
  console.log(`    Key   : ${GROQ_API_KEY.slice(0, 8)}••••••••••••••\n`);
});
