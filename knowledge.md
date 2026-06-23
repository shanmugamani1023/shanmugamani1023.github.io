# Project knowledge

This is a static portfolio website for **Shanmugamani**, a Computer Vision & Machine Learning Engineer.

## Quickstart
- **Setup:** No dependencies. Pure HTML/CSS/JS static site.
- **Dev:** Serve locally: `python -m http.server 8080` then open `http://localhost:8080`
- **Test:** No test framework configured.
- **Build:** No build step. No package.json, no bundler.

## Project Structure
```
/
├── index.html              # Main HTML — all sections
├── assets/
│   ├── css/
│   │   ├── style.css       # Design system, layout, animations
│   │   └── athena.css      # Athena AI assistant UI
│   └── js/
│       ├── script.js       # Portfolio interactivity (particles, navbar, theme, filters)
│       └── athena.js       # Athena AI engine (voice, chat, Gemini API)
├── cloudflare-worker/         # Deployed separately — proxy worker
│   ├── worker.js               # Athena proxy (routes to Gemini / Groq)
│   └── wrangler.toml
├── config/
│   └── config.json             # Local API keys (gitignored)
├── .agents/
│   └── types/
├── favicon.svg
├── Shan_Resume.pdf
├── knowledge.md
└── README.md
```

## Key Files
- **`index.html`** — All site content: Hero, About, Skills, Experience, Projects, Education, Contact, Footer, Athena UI.
- **`assets/css/style.css`** — Dark-themed design system with CSS custom properties. Glassmorphism, cyan/purple gradient, scroll animations.
- **`assets/css/athena.css`** — JARVIS-style holographic UI: glowing orb, chat panel, voice wave, typing dots.
- **`assets/js/script.js`** — OOP-style vanilla JS classes: `ParticleSystem`, `TypeWriter`, `ScrollAnimator`, `CounterAnimator`, `Navbar`, `ThemeManager`, `ProjectFilter`, `ContactForm`.
- **`assets/js/athena.js`** — `Athena` class: voice recognition (Chrome), speech synthesis, Cloudflare Worker proxy calls, conversation management, retry logic.
- **`cloudflare-worker/worker.js`** — Serverless worker: routes queries to Gemini 2.0 Flash or Groq (Llama 3.1) with secure API keys.
- **`config/config.json`** — Local only; contains `ATHENA_API_KEY` and `GROQ_API_KEY`. Gitignored, never committed.

## Athena Setup
1. Deploy the Cloudflare Worker with your API keys as secrets: `npx wrangler secret put ATHENA_API_KEY`
2. Update the proxy URL in `assets/js/athena.js`
3. See README.md for full setup instructions

## Conventions
- **No frameworks/libraries** — Pure vanilla JS; no dependencies beyond Google Fonts.
- **CSS custom properties** — All design tokens in `:root` variables in `style.css`.
- **Animations** — Scroll-triggered via `data-animate` attributes with optional `data-delay`.
- **Naming** — BEM-like class naming (e.g., `skill-card-glass`, `project-showcase-glass`).
