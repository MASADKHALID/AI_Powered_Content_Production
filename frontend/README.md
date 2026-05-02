# ContentAI — Frontend

Pure HTML/CSS/JS. No build step needed. Just open `index.html` in a browser.

## How to use

1. Open `index.html` in any modern browser
2. Enter your free Groq API key (get one at https://console.groq.com/keys)
3. Make sure the backend server is running (see `/backend/README.md`)
4. Pick a niche, platform, topic — hit Generate

## Character Upload

- Upload any character sketch (PNG/JPG) in the left sidebar
- Add a text description of the character
- The character description is sent to the AI for every generation step
- All image prompts and scene descriptions will maintain character consistency
- The character image is shown as a visual reference strip in the Prompts card

## Features

- 5 content niches: Low Poly, Sketch, Exploded View, Facts, Story Narration
- 4 platforms: TikTok, YouTube Shorts, Facebook Reels, Instagram Reels
- 7-stage pipeline: Script → Scenes → Image Prompts → Thumbnail → Animation Tools → SEO → Tips
- Full thumbnail design section with concept, text overlay, and color scheme
- Free tool recommendations for every step
- One-click copy per card

## Backend URL

By default the frontend connects to `http://localhost:3001`.
Click **Backend URL** in the API key row to change it if you deployed the backend elsewhere.

## Files

```
frontend/
  index.html    ← entire frontend (HTML + CSS + JS)
  README.md
```
