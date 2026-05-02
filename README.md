# ContentAI — AI-Powered Niche Content Production Assistant

Full-stack app split into clean frontend + backend.

```
contentai/
├── frontend/
│   ├── index.html      ← entire UI (open in browser, no build needed)
│   └── README.md
└── backend/
    ├── server.js       ← Express + Groq API
    ├── package.json
    └── README.md
```

## Stack

| Layer | Tech | Cost |
|-------|------|------|
| Frontend | HTML / CSS / Vanilla JS | Free |
| Backend | Node.js + Express | Free |
| AI Model | Groq — llama3-70b-8192 | **Free** |
| Image Gen | Leonardo AI, Bing Creator, Canva AI | **Free** |
| Video | CapCut, Clipchamp, Pika Labs | Free / Freemium |

## Quick Start

### 1. Start the backend
```bash
cd backend
npm install
GROQ_API_KEY=gsk_your_key node server.js
# Server runs on http://localhost:3001
```

### 2. Open the frontend
```bash
# Just open in your browser:
open frontend/index.html
# or double-click it in your file manager
```

### 3. Get your free Groq API key
Visit https://console.groq.com/keys — sign up free, create a key.

## What it generates (all AI, one click)

1. **Script** — Hook + Body + CTA tailored to your niche and tone
2. **Scene Breakdown** — 5 timestamped visual directions
3. **Image Prompts** — Ready-to-paste prompts + free tool recommendations
4. **Thumbnail** — Concept, text overlay, color scheme, pro tip
5. **Animation & Video Tools** — Curated free/freemium toolstack
6. **SEO Package** — Title, hashtags, description
7. **Creator Tips** — 5 beginner tips for your niche

## Character Feature

Upload a character sketch in the sidebar + write a description.
The character description is injected into every AI call so all scenes,
prompts, and scripts maintain visual consistency with your character.
