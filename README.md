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

Athena uses Google's Gemini API. To enable her:

1. **Get a free API key** → [Google AI Studio](https://aistudio.google.com/apikey) (needs a Google account)
2. **Open `config/.env`** and replace the placeholder:
   ```
   ATHENA_API_KEY=your_gemini_api_key_here
   ```
   → `ATHENA_API_KEY=AIzaSy...your-actual-key`
3. **Restrict the key** in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Edit your API key → Application restrictions → HTTP referrers
   - Add `localhost:*` (development) and `shanmugamani1023.github.io` (production)
4. **Refresh the page** — Athena will greet you after 3.5 seconds!

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
