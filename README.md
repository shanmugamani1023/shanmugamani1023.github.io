# Shanmugamani — Portfolio Website

Personal portfolio website for **Shanmugamani**, a Computer Vision & Machine Learning Engineer. Features a JARVIS-inspired AI assistant (**Athena**) with voice and chat capabilities, powered by a Cloudflare Worker proxy for secure API key management.

## 🌐 Live Site

**https://shanmugamani1023.github.io/**

## 📁 Project Structure

```
/
├── index.html                  # Main HTML — all sections (Hero, About, Skills, etc.)
├── assets/
│   ├── css/
│   │   ├── style.css           # Design system, layout, animations
│   │   └── athena.css          # Athena AI assistant UI (orb, chat panel, etc.)
│   └── js/
│       ├── script.js           # Portfolio interactivity (particles, navbar, theme, etc.)
│       └── athena.js           # Athena AI engine — calls Cloudflare Worker proxy
├── cloudflare-worker/          # Deployed separately — not part of GitHub Pages site
│   ├── worker.js               # Athena proxy worker (routes to Gemini / Groq)
│   └── wrangler.toml           # Cloudflare Workers config
├── config/
│   └── config.json             # ⬅️ Local only — API keys (gitignored, never committed)
├── .agents/                    # Codebuff agent type definitions
│   └── types/
├── .gitignore
├── favicon.svg                 # Branded SM favicon
├── Shan_Resume.pdf             # Resume PDF
├── knowledge.md                # Project knowledge / conventions
└── README.md                   # This file
```

## 🚀 Quickstart

### 1. Open the site
No build tools needed — just open `index.html` in a browser:

```bash
# Windows
start index.html

# macOS
open index.html
```

Or serve locally with Python:
```bash
python -m http.server 8080
# Visit http://localhost:8080
```

### 2. Set up Athena (AI Assistant)

Athena uses a **Cloudflare Worker** as a secure proxy — all API keys stay server-side and are never exposed to the browser. The worker supports **multi-provider fallback** (Gemini → Groq) in case one service is unavailable.

| Provider | Type | Model | Free Tier |
|---|---|---|---|
| **Gemini** (primary) | Google Gemini 2.0 Flash | `gemini-2.0-flash` | 60 req/min |
| **Groq** (fallback) | Llama 3.1 via Groq | `llama-3.1-8b-instant` | 30 req/min |

#### Setup

1. **Get API keys:**
   - **Gemini** → [Google AI Studio](https://aistudio.google.com/apikey) (free, needs Google account)
   - **Groq** → [Groq Console](https://console.groq.com/keys) (free, needs account — optional fallback)

2. **Deploy the Cloudflare Worker:**
   ```bash
   cd cloudflare-worker/
   ```

   Create a `wrangler.toml` (or edit the existing one):
   ```toml
   name = "athena-proxy"
   main = "worker.js"
   compatibility_date = "2024-09-25"

   [vars]
   ALLOWED_ORIGIN = "https://shanmugamani1023.github.io"
   ```

   Set your API keys as Cloudflare Worker secrets:
   ```bash
   npx wrangler secret put ATHENA_API_KEY
   # Paste your Gemini API key

   npx wrangler secret put GROQ_API_KEY
   # Paste your Groq API key (optional)
   ```

   Deploy the worker:
   ```bash
   npx wrangler deploy
   ```

3. **Update the proxy URL** in `assets/js/athena.js`:
   ```js
   this.proxyUrl = 'https://athena-proxy.your-subdomain.workers.dev';
   ```

4. **Update** `cloudflare-worker/wrangler.toml` → `[vars]` with your production origin, then redeploy:
   ```bash
   npx wrangler deploy
   ```

5. **Refresh the page** — Athena will greet you after 3.5 seconds!

> ⚠️ **`config/config.json` and `cloudflare-worker/` are gitignored** — your API keys and worker source stay local and never get committed to the repository.
>
> **Only need one provider?** That's fine — Athena works with just Gemini or just Groq. Add whichever keys you have.

### 3. Develop the Worker Locally
```bash
cd cloudflare-worker/
echo '{"ATHENA_API_KEY":"your-key","GROQ_API_KEY":"your-key"}' > .dev.vars
npx wrangler dev
```

### 4. Deploy to GitHub Pages
```bash
git add -A
git commit -m "Your message"
git push origin main
```
GitHub Pages auto-deploys from the `main` branch.

## 🧠 What Athena Knows

Athena is trained on your portfolio data and can answer questions about:

- **About** — Name, role, location, experience
- **Skills** — Programming languages, AI/ML, frameworks, tools
- **Experience** — Digit7 (current), Shrav Infotech (previous)
- **Projects** — Autonomous Retail CV, AI Chatbot, Air-Filter Inspection, Image Proofing
- **Education** — B.E Mechanical Engineering, certifications
- **Contact** — Email, phone, GitHub, LinkedIn, Resume

## ✨ Features

| Feature | Description |
|---|---|
| **Athena AI** | Voice + chat assistant with JARVIS-style holographic UI |
| **Cloudflare Worker Proxy** | API keys kept server-side — never exposed to the client |
| **Multi-provider fallback** | Auto-failover from Gemini → Groq if one provider is down |
| **Dark/Light theme** | Toggle with localStorage persistence |
| **Project filters** | Filter by category (Computer Vision, AI, Industrial) |
| **Resume download** | Button in hero + contact section |
| **SEO & Social** | OG tags, Twitter Card, JSON-LD structured data |
| **Animations** | Scroll-triggered reveals, particle background, typewriter effect |
| **Responsive** | Works on desktop, tablet, and mobile |

## 🔧 Tech Stack

- **Pure HTML/CSS/JS** — No frameworks, no build tools, no dependencies.
- **Cloudflare Workers** — Secure proxy for AI API calls.
- **Google Gemini 2.0 Flash** — Primary AI provider (free tier).
- **Groq (Llama 3.1)** — Fallback AI provider (free tier).
- **Web Speech API** — Voice input (Chrome) and voice output.
- **GitHub Pages** — Hosting for the static site.

## 🔒 API Key Security

API keys are stored as **Cloudflare Worker secrets** and are **never exposed** in client-side code or the repository. The Athena AI assistant communicates exclusively through the Cloudflare Worker proxy (`athena-proxy`), which:
1. Receives the user's query from the browser
2. Adds the API key server-side
3. Routes to Gemini (or falls back to Groq)
4. Returns only the AI response text to the browser

This means your API keys remain private even on a fully client-side GitHub Pages deployment.
