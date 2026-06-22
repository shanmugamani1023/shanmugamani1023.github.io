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
├── config/
│   └── .env                # Gemini API key (edit to enable Athena)
├── favicon.svg
├── Shan_Resume.pdf
├── knowledge.md
└── README.md               # Full setup & deployment docs
```

## Key Files
- **`index.html`** — All site content: Hero, About, Skills, Experience, Projects, Education, Contact, Footer, Athena UI.
- **`assets/css/style.css`** — Dark-themed design system with CSS custom properties. Glassmorphism, cyan/purple gradient, scroll animations.
- **`assets/css/athena.css`** — JARVIS-style holographic UI: glowing orb, chat panel, voice wave, typing dots.
- **`assets/js/script.js`** — OOP-style vanilla JS classes: `ParticleSystem`, `TypeWriter`, `ScrollAnimator`, `CounterAnimator`, `Navbar`, `ThemeManager`, `ProjectFilter`, `ContactForm`.
- **`assets/js/athena.js`** — `Athena` class: voice recognition (Chrome), speech synthesis, Gemini 3.5 Flash API, conversation management, retry logic.
- **`config/.env`** — Contains `ATHENA_API_KEY=your_key`. Committed to repo so it works on GitHub Pages.

## Athena Setup
1. Get a free Gemini API key from https://aistudio.google.com/apikey
2. Edit `config/.env` — replace `your_gemini_api_key_here` with your actual key
3. Restrict the key by HTTP referrer in Google Cloud Console

## Conventions
- **No frameworks/libraries** — Pure vanilla JS; no dependencies beyond Google Fonts.
- **CSS custom properties** — All design tokens in `:root` variables in `style.css`.
- **Animations** — Scroll-triggered via `data-animate` attributes with optional `data-delay`.
- **Naming** — BEM-like class naming (e.g., `skill-card-glass`, `project-showcase-glass`).
