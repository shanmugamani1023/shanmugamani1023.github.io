# Shanmugamani — Portfolio Website

Personal portfolio website for **Shanmugamani**, a Computer Vision & Machine Learning Engineer. Features a JARVIS-inspired AI assistant (**Athena**) with voice and chat capabilities.

## 🌐 Live Site

**https://shanmugamani1023.github.io**

## 📁 Project Structure

```
/
├── index.html              # Main HTML — all sections (Hero, About, Skills, etc.)
├── assets/
│   ├── css/
│   │   ├── style.css       # Design system, layout, animations
│   │   └── athena.css      # Athena AI assistant UI (orb, chat panel, etc.)
│   └── js/
│       ├── script.js       # Portfolio interactivity (particles, navbar, theme, etc.)
│       └── athena.js       # Athena AI engine (voice, chat, Gemini API)
├── config/
│   └── .env                # ⬅️ API key configuration (edit this file)
├── favicon.svg             # Branded SM favicon
├── Shan_Resume.pdf         # Resume PDF
├── knowledge.md            # Project knowledge / conventions
└── README.md               # This file
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

Athena uses **multi-provider fallback** — if one AI service is down or rate-limited, it automatically tries the next. Currently supports:

| Provider | Type | Free Tier |
|---|---|---|
| **Gemini** (primary) | Google Gemini 3.5 Flash | 60 req/min |
| **Groq** (fallback) | Llama 3.1 8B via Groq | 30 req/min |

#### Setup

1. **Copy the example config** (one time only):
   ```bash
   cp config/config.example.json config/config.json
   ```

2. **Open `config/config.json`** and add your API keys:
   ```json
   {
     "ATHENA_API_KEY": "AIzaSy...your-actual-gemini-key",
     "GROQ_API_KEY": "gsk_your-actual-groq-key"
   }
   ```

3. **Get API keys:**
   - **Gemini** → [Google AI Studio](https://aistudio.google.com/apikey) (free, needs Google account)
   - **Groq** → [Groq Console](https://console.groq.com/keys) (free, needs account)

4. **Restrict keys by HTTP referrer** for security:
   - **Gemini**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Edit key → HTTP referrers → add `localhost:*` and `shanmugamani1023.github.io`
   - **Groq**: [Groq API Keys](https://console.groq.com/keys) → Edit key → Allowed HTTP referrers

5. **Refresh the page** — Athena will greet you after 3.5 seconds!

> ⚠️ **`config/config.json` is gitignored** — your real API keys stay local and never get committed. Only `config/config.example.json` (with placeholders) is pushed to GitHub.
>
> **Only need one provider?** That's fine — Athena works with just Gemini or just Groq. Add whichever keys you have.

### 3. Deploy to GitHub Pages
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
| **Dark/Light theme** | Toggle with localStorage persistence |
| **Project filters** | Filter by category (Computer Vision, AI, Industrial) |
| **Resume download** | Button in hero + contact section |
| **SEO & Social** | OG tags, Twitter Card, JSON-LD structured data |
| **Animations** | Scroll-triggered reveals, particle background, typewriter effect |
| **Responsive** | Works on desktop, tablet, and mobile |

## 🔧 Tech Stack

- **Pure HTML/CSS/JS** — No frameworks, no build tools
- **Google Gemini 3.5 Flash** — AI responses (free tier)
- **Web Speech API** — Voice input (Chrome) and voice output
- **GitHub Pages** — Hosting

## 🔒 API Key Security

The API key in `config/.env` is committed to the repository and is publicly visible on the client side. This is expected for a client-side-only app. **Always restrict the key by HTTP referrer** in Google Cloud Console to prevent abuse from other domains.
