# ROI Calculator — Pricing Page

**Date:** 2026-04-17
**Status:** Approved

---

## Overview

An inline ROI calculator on the Pricing page that lets prospects compare the cost of building vendor integrations in-house versus using OneHazel. Helps justify the platform cost to leadership with a personalised savings figure.

## Audience

Prospects evaluating OneHazel — comparing it against in-house integration development. The calculator provides a concrete number they can take to their leadership team.

## Location

- New `<section id="roi-calculator">` between the tier cards and the top-up packs section
- "Calculate Your ROI" anchor link added to the hero section, smooth-scrolls to `#roi-calculator`
- Applies to both GitHub Pages (`pricing.html`) and HubSpot CMS (`onehazel-theme/templates/pricing.html`)

## Layout

Two-column grid (stacks vertically on mobile):

**Left panel — Inputs:**
- 3 range sliders: integrations needed, developers on integrations, developer hourly cost
- Collapsible "Adjust assumptions" panel with editable fields for hours-to-build and maintenance-hours-per-month

**Right panel — Results (live-updating):**
- Big savings headline using `gradient-text`
- Payback period badge (green accent)
- Recommended tier card with name, price, and founding price
- CTA button linking to `app.onehazel.com` (or `/contact` for Enterprise)

## Inputs & Defaults

| Input | Default | Range | Step | Location |
|-------|---------|-------|------|----------|
| Vendor integrations needed | 10 | 1–50 | 1 | Main slider |
| Developers on integrations | 2 | 1–20 | 1 | Main slider |
| Developer cost (EUR/hr) | 85 | 30–200 | 5 | Main slider |
| Hours to build per integration | 120 | 40–300 | 10 | Assumptions panel |
| Maintenance hrs/mo per integration | 15 | 5–40 | 1 | Assumptions panel |

## Calculation Logic

### In-house annual cost

```
buildCost       = integrations * hoursPerBuild * hourlyRate
maintenanceCost = integrations * maintenanceHoursPerMonth * hourlyRate * 12
totalInHouse    = buildCost + maintenanceCost
```

### OneHazel annual cost

Tier auto-selected by integration count:

| Integrations | Tier | Annual price/mo | Monthly price/mo |
|-------------|------|-----------------|------------------|
| 1–5 | Grow | EUR 999 | EUR 1,199 |
| 6–20 | Scale | EUR 2,499 | EUR 2,999 |
| 21+ | Enterprise | Contact Sales | Contact Sales |

```
oneHazelAnnualCost = tierMonthlyPrice * 12
```

Reads the current billing toggle state (`billing-annual` / `billing-monthly` class on `#pricing-container`) to select the correct price column.

For Enterprise: uses Scale pricing as a placeholder for the savings calculation, but CTA shows "Contact Sales" instead of "Get Started".

### Output

```
annualSavings = totalInHouse - oneHazelAnnualCost
paybackMonths = oneHazelAnnualCost / (totalInHouse / 12)
```

### Edge Cases

- **Negative savings:** If OneHazel would cost more than in-house, show "Talk to us about your specific use case" with a Contact Sales CTA instead of a negative number
- **Payback floor:** Cap at "< 1 month" at the low end
- **Payback ceiling:** Cap at "12+ months" at the high end
- **Enterprise tier:** Show "Contact Sales" CTA, not "Get Started"

## Currency Formatting

`Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })`

No external library needed.

## Implementation — GitHub Pages

### Files modified

| File | Change |
|------|--------|
| `pricing.html` | New `<section id="roi-calculator">` between tiers and top-ups. New anchor link in hero. |
| `styles.css` | Slider track/thumb styling, assumptions panel toggle, results card layout |
| `main.js` | `initROICalculator()` function — binds slider events, recalculates on input, formats output |

### Design system usage

Uses existing classes: `card`, `badge`, `btn-primary`, `btn-secondary`, `gradient-text`, `mono`, `section-alt`, `fade-up`, `stat-num`. No new one-off styles — slider styling added as reusable CSS in `styles.css`.

## Implementation — HubSpot CMS

### New module: `roi-calculator.module/`

| File | Purpose |
|------|---------|
| `meta.json` | Module metadata, label, icon |
| `fields.json` | All default values as editable module fields (hours to build, maintenance hours, hourly rate, tier thresholds) so marketing can adjust assumptions without code |
| `module.html` | Identical HTML structure to GitHub Pages version, using same CSS classes from `styles.css` |

### Template change

`onehazel-theme/templates/pricing.html`:
- New `{% dnd_area "roi_calculator" %}` containing `roi-calculator.module` between the tier section and top-up section
- Anchor link added to the hero section

### JS approach

Calculator JS embedded via `{% require_js position="footer" %}` in the module using an IIFE pattern (same approach as the billing toggle). The calculation logic is duplicated (~40 lines) — not worth an external dependency for a static site.

## Responsive Behaviour

- **Desktop (768px+):** Two-column grid, inputs left, results right
- **Mobile (<768px):** Single column, inputs stacked on top, results below
- Sliders remain full-width on mobile
- Results card gets slightly less padding on mobile

## Animations

- Section uses `fade-up` entrance animation (consistent with rest of page)
- Results update instantly on slider input — no debounce needed for a pure calculation
- Slider thumb and track use the accent gold colour from CSS custom properties
- Savings number gets a brief CSS transition on value change (opacity fade)
