# Project knowledge

This is a static portfolio website for **Shanmugamani**, a Computer Vision & Machine Learning Engineer.

## Quickstart
- **Setup:** No dependencies. This is a pure HTML/CSS/JS static site.
- **Dev:** Open `index.html` in a browser (e.g., `start index.html` on Windows, `open index.html` on macOS).
- **Test:** No test framework configured.
- **Build:** No build step. No package.json, no bundler.

## Architecture
- **`index.html`** — Main HTML file containing all sections: Hero, About, Skills, Experience, Projects, Education, Contact.
- **`style.css`** — Dark-themed design system with custom properties (`:root` variables). Uses glassmorphism, cyan/purple accent gradient, and smooth scroll-triggered transitions.
- **`script.js`** — Vanilla JS with OOP-style classes:
  - `ParticleSystem` — Canvas-based animated particle background
  - `TypeWriter` — Typing effect for role titles
  - `ScrollAnimator` — IntersectionObserver-based reveal animations
  - `CounterAnimator` — Animated stat counters
  - `Navbar` — Scroll-aware nav with active section highlighting & mobile toggle
  - `ContactForm` — Client-side form submission handler (prevent default, shows success state)
- **`Shan_Resume.pdf`** — Resume PDF in project root.

## Conventions
- **No frameworks/libraries** — Pure vanilla JS; no jQuery, React, or external dependencies beyond Google Fonts (Inter, JetBrains Mono).
- **CSS custom properties** — All colors, fonts, and spacing are defined in `:root` variables in `style.css`.
- **Animations** — Scroll-triggered via `data-animate` attributes with optional `data-delay` (ms). Supported types: `fade-up`, `fade-left`, `fade-right`.
- **Naming** — BEM-like class naming (e.g., `skill-card-glass`, `project-showcase-glass`). Sections follow a consistent `section-tag`, `section-title`, `section-line` pattern.
- **Things to avoid:**
  - Don't add npm dependencies unless necessary — the project has no build tooling.
  - Don't break the canvas particle background (it sits at `z-index: 0` behind all content).
  - Don't remove the `scroll-padding-top` — it accounts for the fixed navbar height.
