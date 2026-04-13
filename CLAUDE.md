# OneHazel Website — Project Instructions

## What This Is

Static marketing website for OneHazel — an AI-powered Vertical iPaaS (Integration Platform as a Service) built by ZS Digital Ltd. Hosted on GitHub Pages at onehazel.com.

## Tech Stack

- **Static HTML** — no build step, no framework, no bundler
- **Tailwind CSS** via Play CDN (`cdn.tailwindcss.com`) — JIT, no local install
- **Shared stylesheet** — `styles.css` contains all theme tokens, component classes, animations, and sector-specific overrides
- **Shared JS** — `main.js` handles theme toggle, mobile menu, and background icon decorations
- **Font Awesome 6.5.1** — via CDN with SRI integrity hash
- **Google Fonts** — Plus Jakarta Sans (body) + IBM Plex Mono (stats/labels)
- **HubSpot** — analytics embed on all pages, form embed on contact page (portal 146772601)

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage |
| `igaming.html` | iGaming industry page |
| `healthcare.html` | Healthcare industry page |
| `construction.html` | Construction industry page |
| `cannabis.html` | Cannabis industry page |
| `lifesciences.html` | Life Sciences industry page |
| `energy.html` | Energy & Utilities industry page |
| `pricing.html` | Pricing tiers (Free + Enterprise live, Pro + Teams coming soon) |
| `about.html` | About Us |
| `contact.html` | Contact with HubSpot embedded form |
| `terms.html` | Terms & Conditions |
| `privacy.html` | Privacy Policy (GDPR) |
| `styles.css` | Shared design system — ALL visual styling |
| `main.js` | Shared JS — theme toggle, mobile menu, sector decorations |
| `favicon.svg` | SVG favicon (gold 1 + black H) |
| `index-secure.html` | Legacy auth-gated version (unused) |
| `login.html` | Legacy login redirect (unused) |

## Design System

### Theme Architecture

- **Light mode** is default. Dark mode toggled via `.dark` class on `<html>`.
- ALL colors use CSS custom properties defined in `:root` / `.dark` blocks in `styles.css`.
- Never hardcode colors — always use `var(--text)`, `var(--bg-card)`, `var(--accent-bright)`, etc.

### Sector System

Industry pages set `data-sector="igaming"` (etc.) on `<html>`. This activates:
- `--sector` / `--sector-bright` / `--sector-soft` / `--sector-border` color overrides
- `--glow-1` / `--glow-2` / `--glow-3` for gradient mesh backgrounds
- Sector-specific SVG texture patterns on `.section-alt`
- Themed FA icon decorations injected by `main.js`

### Key CSS Classes

| Class | Usage |
|-------|-------|
| `card` | White card with border, shadow, hover lift |
| `badge` | Mono pill badge (accent colored) |
| `badge-sector` | Sector-colored badge variant |
| `btn-primary` | Dark bg button (inverts in dark mode) |
| `btn-secondary` | Border-only button |
| `gradient-text` | Amber-to-gold gradient on text |
| `gradient-text-sector` | Sector-colored text gradient |
| `stat-num` | IBM Plex Mono stat numbers in accent color |
| `mono` | IBM Plex Mono utility |
| `section-alt` | Alternating section with gradient mesh + texture |
| `section-base` | Standard section background |
| `divider` | Border using theme border color |
| `vendor-tag` | Styled vendor name tag (industry pages) |
| `fade-up` / `fade-up-1/2/3` | Staggered entrance animations |

### Shared Nav Pattern

Every page uses the identical nav from `index.html`:
- Desktop: logo, Industries dropdown, Pricing, About, Contact, theme toggle, Sign up CTA
- Mobile (<768px): logo + burger button that opens full-screen off-canvas menu
- Logo: `<span class="gradient-text">ONE</span>HAZEL`

### Shared Footer Pattern

4-column grid: OneHazel brand | Product (Pricing, API Docs, Sign up) | Company (About, Contact) | Legal (Terms, Privacy). Copyright: ZS Digital Ltd.

## Conventions

### When Editing Pages

- **Always use CSS variables** from `styles.css` — never inline hex colors
- **Use existing component classes** (`card`, `badge`, `btn-primary`) — don't create one-off styles
- **Nav and footer are identical on every page** — if you change one, change all
- **Inline `<script>` blocks must NOT exist** — all JS lives in `main.js`
- **Semgrep**: Tailwind CDN gets `<!-- nosemgrep -->` on same line. HubSpot embed gets `<!-- nosemgrep -->` on the line before. Font Awesome uses real SRI hash.

### When Adding a New Page

1. Copy head block from any existing page (Tailwind, FA, styles.css, favicon, HubSpot embed)
2. Copy the exact nav + mobile menu HTML
3. Copy the exact footer HTML
4. Reference `<script src="/main.js"></script>` before `</body>`
5. Use `section-base` / `section-alt` alternating backgrounds

### When Adding a New Industry

1. Add `[data-sector="newsector"]` block to `styles.css` with `--sector`, `--sector-bright`, `--sector-soft`, `--sector-border`, `--glow-1/2/3` (both light and dark)
2. Add sector SVG texture pattern in `styles.css`
3. Add sector icon set to `main.js` `iconSets` object
4. Add sector to Industries dropdown in nav on ALL pages
5. Add sector to Industries grid on `index.html`

## Business Context

- **Product**: OneHazel — AI-powered iPaaS with 300+ connectors, visual workflow builder (22 node types), AI workflow generation
- **Company**: ZS Digital Ltd, registered in Malta
- **App**: app.onehazel.com (separate repo)
- **API Docs**: app.onehazel.com/docs
- **Status**: V1.0 live. Free + Enterprise tiers available. Pro + Teams coming soon.
- **CTA text**: "Sign up to BETA" (not "Launch App")
