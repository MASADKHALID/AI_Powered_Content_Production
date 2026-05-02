# ContentAI — Backend

Powered by **Groq API** (free, ultra-fast, llama3-70b-8192).

## Setup

```bash
cd backend
npm install
node server.js
```

## Environment

Set your Groq API key (get it free at https://console.groq.com):

```bash
# Option 1: env variable (recommended)
GROQ_API_KEY=gsk_your_key node server.js

# Option 2: pass per-request in frontend (see frontend README)
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| POST | /api/generate | Full content pipeline |

## POST /api/generate

**Body:**
```json
{
  "topic": "How black holes form",
  "niche": "Low Poly Animation",
  "platform": "TikTok",
  "duration": "60",
  "tone": "Educational",
  "apiKey": "gsk_your_groq_key",
  "characterDesc": "optional character description"
}
```

**Response:**
```json
{
  "script": { "hook": "...", "body": "...", "cta": "..." },
  "scenes": [{ "scene": 1, "time": "0–10s", "visual": "..." }],
  "prompts": { "mainPrompt": "...", "negativePrompt": "...", "freeTools": [], "paidTools": [] },
  "thumbnail": { "concept": "...", "textOverlay": "...", "colorScheme": "...", "tip": "..." },
  "tools": [{ "name": "...", "type": "Free", "color": "accent", "description": "..." }],
  "seo": { "title": "...", "tags": "...", "description": "...", "thumbnail_tip": "..." },
  "tips": ["...", "..."]
}
```

## Free Groq Models Available

- `llama3-70b-8192` — most capable (default)
- `llama3-8b-8192` — fastest
- `mixtral-8x7b-32768` — large context window

Get your free API key: https://console.groq.com
