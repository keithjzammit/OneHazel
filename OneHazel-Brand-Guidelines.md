# OneHazel Brand Guidelines
**Version 1.0 — April 2026**
*Produced by ZS Digital Ltd / Elevate AI*

---

## 1. Brand Overview

**OneHazel** is the Vertical iPaaS (Integration Platform as a Service) built by Elevate AI. It uses autonomous AI agents to connect platforms to the world's intelligence ecosystem — 300+ connectors, built in minutes, maintained automatically.

| | |
|---|---|
| **Full name** | OneHazel |
| **Tagline** | *The last integration you'll ever build.* |
| **Sub-brand** | Built by Elevate AI |
| **Legal entity** | ZS Digital Ltd |
| **Registered** | Malta |
| **Website** | onehazel.com |
| **App** | app.onehazel.com |
| **Product category** | Vertical iPaaS / AI Workflow Automation |

---

## 2. Mission & Positioning

> *"We saw brilliant companies held back by a problem that shouldn't exist. The tools to transform your business are already out there. The only thing standing between you and them is the integration. We're removing that barrier entirely."*
> — Keith Zammit, CEO

### What we do
OneHazel uses autonomous AI agents to generate, deploy, and maintain API connectors — turning months of integration work into minutes.

### Who we serve
Operators, vendors, and platform providers in regulated, complex industries: iGaming, Healthcare, Construction, Cannabis, Life Sciences, and Energy & Utilities.

### Core differentiator
**Autonomous maintenance.** Connectors don't just get built — they get monitored and self-repaired when upstream APIs change.

---

## 3. Brand Voice & Tone

### Principles

| Principle | In practice |
|-----------|-------------|
| **Direct** | Say what we mean. No marketing fluff, no vague promises. |
| **Technical peer** | We talk to engineers and operators as equals. |
| **Confident, not boastful** | Back every claim with specifics (300+ connectors, 10 minutes, 0 failures). |
| **Honest about maturity** | We're in BETA. We acknowledge what's live vs. what's on the roadmap. |
| **No integration jargon for its own sake** | Explain the outcome, not the mechanism. |

### Voice examples

| Instead of… | Say… |
|-------------|------|
| "Leverage our cutting-edge platform…" | "Connect your platform to 300+ vendors in minutes." |
| "Our AI-powered solution synergises…" | "Our AI agents build the connector. You get the data." |
| "Enterprise-grade security posture" | "AES-256 encryption, tenant isolation, RBAC — live today." |
| "Best-in-class integration experience" | "From API spec to production in 6 steps." |

### Phrases we use
- *No more integration debt.*
- *No more vendor lock-in.*
- *No more 2am fires.*
- *One integration. Every vendor. That's it.*
- *Stop building pipes. Start building value.*
- *Built in minutes, maintained automatically.*

---

## 4. Logo

### Wordmark

```
ONEHAZEL
```

- **ONE** — rendered in the brand gradient (amber → gold)
- **HAZEL** — rendered in the primary text colour, tight letter-spacing (−0.04em)
- Never separate ONE from HAZEL
- The wordmark is always set in **Plus Jakarta Sans ExtraBold (800)**

### Sub-brand line
When the parent brand needs acknowledgement:

```
ONEHAZEL / Elevate AI
```

The ` / Elevate AI` portion is set in the muted text colour, normal weight, and is hidden on small screens.

### Favicon
- Black square background (`#0A0A0A`), rounded corners (rx 6)
- Characters **1H** in cream-gold (`#FDE68A`), Plus Jakarta Sans Bold 16px
- Do not use the full wordmark at favicon sizes

### Clear space
Maintain minimum clear space equal to the cap-height of the "O" on all sides of the wordmark.

### What not to do
- Do not recolour ONE or HAZEL independently
- Do not place the wordmark on a busy photographic background without an overlay
- Do not stretch or condense the letterforms
- Do not use a drop shadow

---

## 5. Colour Palette

### Primary — Brand Amber

| Role | Light mode | Dark mode | Usage |
|------|-----------|-----------|-------|
| Accent | `#B45309` | `#FBBF24` | Gradient start, links, icons |
| Accent Bright | `#D97706` | `#FCD34D` | Gradient end, CTAs, highlights |
| Accent Soft | `rgba(217,119,6, 0.07)` | `rgba(251,191,36, 0.08)` | Card tints, badge backgrounds |
| Accent Border | `rgba(217,119,6, 0.20)` | `rgba(251,191,36, 0.20)` | Card borders, dividers |

### Gradient
The signature OneHazel gradient runs at **135°** from Accent → Accent Bright.

```css
linear-gradient(135deg, #B45309 0%, #D97706 100%)   /* Light */
linear-gradient(135deg, #FBBF24 0%, #FDE68A 100%)   /* Dark */
```

Use for: logo ONE, section headings, CTAs, hero text spans.

### Background

| Token | Light | Dark |
|-------|-------|------|
| `--bg` (page) | `#FAFAF9` | `#09090B` |
| `--bg-card` | `#FFFFFF` | `#18181B` |
| `--bg-subtle` | `#F4F4F5` | `#1C1C1F` |
| `--bg-invert` | `#18181B` | `#FAFAFA` |

### Text

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#18181B` | `#FAFAFA` |
| Secondary | `#52525B` | `#A1A1AA` |
| Muted | `#A1A1AA` | `#52525B` |

### Supporting — Success Green

| Role | Light | Dark |
|------|-------|------|
| Success | `#059669` | `#34D399` |
| Success Bright | `#10B981` | `#6EE7B7` |

Used for: checkmarks, "live" indicators, positive states.

### Borders

| Token | Light | Dark |
|-------|-------|------|
| Border | `#E4E4E7` | `#27272A` |
| Border Hover | `#D4D4D8` | `#3F3F46` |

### Sector Accent Colours
Industry pages override the amber accent with a sector-specific colour:

| Industry | Light accent | Dark accent |
|----------|-------------|------------|
| iGaming | `#10B981` (emerald) | `#34D399` |
| Healthcare | `#0891B2` (cyan) | `#22D3EE` |
| Construction | `#D97706` (amber) | `#FBBF24` |
| Cannabis | `#65A30D` (lime) | `#A3E635` |
| Life Sciences | `#7C3AED` (violet) | `#A78BFA` |
| Energy & Utilities | `#CA8A04` (yellow) | `#FACC15` |

---

## 6. Typography

### Typefaces

| Role | Font | Weights |
|------|------|---------|
| **Display / Headings / Body** | Plus Jakarta Sans | 300, 400, 500, 600, 700, **800** |
| **Stats / Labels / Code / Mono** | IBM Plex Mono | 400, 500, 600 |

Both are served via Google Fonts.

### Heading style
- Weight: **ExtraBold (800)**
- Letter-spacing: **−0.03em to −0.04em** (tight)
- Line-height: **1.05 – 1.1** for hero headings; **1.2 – 1.3** for section headings
- Colour: `var(--text)` — never a mid-grey for headings

### Display sizes (fluid)

| Level | Size |
|-------|------|
| Hero H1 | `clamp(2.6rem, 7vw, 5.5rem)` |
| Section H2 | `3rem – 5rem` |
| Card H3 | `1.5rem – 2rem` |

### IBM Plex Mono usage
Reserved for: stat numbers (`300+`, `~10 min`), badge labels, code snippets, data table values. Never use for body copy.

---

## 7. UI Components

### Buttons

| Variant | Appearance |
|---------|-----------|
| **Primary** (`btn-primary`) | Dark fill (`--bg-invert`), white text; inverts correctly in dark mode |
| **Secondary** (`btn-secondary`) | Border only, transparent fill |
| CTA label | *"Sign up to BETA"* + arrow icon — always this exact copy for the main CTA |

### Cards (`card`)
- White/card-bg fill
- `1px` border using `--border`
- `8px` border-radius
- Subtle box-shadow
- Hover: lifts with increased shadow

### Badges
| Variant | Usage |
|---------|-------|
| `badge` | Mono pill, amber accent; product labels |
| `badge-sector` | Sector-colour variant on industry pages |

### Section backgrounds
Pages alternate between:
- `section-base` — plain `--bg`
- `section-alt` — radial gradient mesh using `--glow-1/2/3` + a subtle SVG texture; background icons injected by `main.js`

---

## 8. Iconography

Font Awesome 6.5 (Free tier, CDN with SRI hash).

### Core icons used by brand
| Context | Icon |
|---------|------|
| iGaming | `fa-dice` (emerald) |
| Healthcare | `fa-heartbeat` (cyan) |
| Construction | `fa-hard-hat` (amber) |
| Cannabis | `fa-leaf` (lime) |
| Life Sciences | `fa-flask` (violet) |
| Energy & Utilities | `fa-bolt` (yellow) |
| Security / trust | `fa-shield-check`, `fa-lock` |
| AI / automation | `fa-microchip`, `fa-robot`, `fa-brain` |
| Navigation chevron | `fa-chevron-down` (9px, muted) |
| External link arrow | `fa-arrow-right` |

Background decoration icons on `section-alt` panels are injected programmatically from a sector-specific set, rendered at low opacity as ambient texture.

---

## 9. Photography & Imagery

### Style
- **Real, specific** — actual team photos, real locations. No stock clichés.
- **Warm tones** — images should feel grounded and southern European where possible
- **Dark overlays** — when text sits over a photo, use `brightness(0.55) saturate(0.9)` or a `rgba(0,0,0,0.5–0.65)` gradient overlay

### Current approved images

| Asset | Usage | Treatment |
|-------|-------|-----------|
| `/images/malta.jpg` | Full-width Malta banner section | `brightness(0.55) saturate(0.9)` overlay |
| `/images/keith-conference.jpg` | CEO quote section (AIBC Summit, Malta) | Cropped square, subtle overlay |
| `/images/team/keith-zammit.jpg` | Team card – CEO | Circular, 96×96px |
| `/images/team/christian-harms.jpg` | Team card – CTO | Circular, 96×96px |
| `/images/team/ella-beaumont.jpg` | Team card – COO | Circular, 96×96px |

### Image optimisation standard
- Max width: 1200px (hero/banner), 400px (avatars/thumbnails)
- Format: JPEG at 82–85% quality
- No PNG for photos (SVG only for icons/logos)

---

## 10. Team & Company

### Leadership

| Name | Title |
|------|-------|
| Keith Zammit | CEO & Co-Founder |
| Christian Harms | CTO & Co-Founder |
| Ella Beaumont | COO |

### Advisory Board
Members with backgrounds in iGaming, financial services, AML, risk management, and enterprise technology.

### Company facts
- Incorporated: **ZS Digital Ltd**, Malta
- Parent brand: **Elevate AI** (joinelevateai.com)
- Product: **OneHazel** — V1.0 live, BETA
- Tiers live: Free + Enterprise
- Tiers coming soon: Pro + Teams

---

## 11. Product Description (Boilerplate)

**Short (1 sentence):**
> OneHazel is the Vertical iPaaS that uses autonomous AI agents to connect platforms to 300+ vendors — in minutes, not months.

**Medium (2–3 sentences):**
> OneHazel is the Vertical iPaaS built for regulated, data-intensive industries. Our autonomous AI agents generate production-grade connectors from API specs, monitor them continuously, and repair them automatically when APIs change. 300+ connectors live today — built in minutes, maintained forever.

**Full:**
> OneHazel is an AI-powered integration platform (iPaaS) purpose-built for iGaming, healthcare, construction, cannabis, life sciences, and energy sectors. Instead of months of custom connector work, OneHazel's AI agents take an API spec and produce a tested, production-ready connector in approximately 10 minutes. Connectors are monitored continuously and self-repaired when upstream APIs change — eliminating integration debt permanently. The platform includes a visual workflow builder with 22 node types, AI workflow generation, a searchable vendor marketplace, and a growing library of 300+ live connectors. OneHazel is a product of Elevate AI, built and operated by ZS Digital Ltd, registered in Malta.

---

## 12. Digital Standards

### Web
- Light mode default; dark mode toggled via user preference or localStorage
- Mobile-first responsive; breakpoints follow Tailwind defaults (sm: 640px, md: 768px, lg: 1024px)
- Max content width: `max-w-7xl` (1280px)
- All colours via CSS custom properties — no hardcoded hex in HTML

### Analytics
- PostHog (EU region, project: OneHazel)
- HubSpot (portal 146772601) — analytics on all pages, form on contact page

### Attributions required on all pages
- Logo.dev: `Logos provided by Logo.dev` (linked, muted footer text)

---

*OneHazel Brand Guidelines v1.0 — ZS Digital Ltd © 2026*
