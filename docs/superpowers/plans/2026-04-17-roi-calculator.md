# ROI Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an inline ROI calculator to the Pricing page (both GitHub Pages and HubSpot CMS) that lets prospects compare in-house integration costs against OneHazel.

**Architecture:** New HTML section + CSS slider styles + vanilla JS calculator function. GitHub Pages version lives in `pricing.html` / `styles.css` / `main.js`. HubSpot version is a new DnD module `roi-calculator.module` with embedded JS. Both share the same CSS via `styles.css` served from onehazel.com.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JS, HubL templating

**Spec:** `docs/superpowers/specs/2026-04-17-roi-calculator-design.md`

---

### Task 1: Add slider and ROI calculator CSS to `styles.css`

**Files:**
- Modify: `styles.css` (append to end, before any sector-specific blocks)

- [ ] **Step 1: Add range slider styling**

Append to `styles.css`:

```css
/* ===== ROI CALCULATOR ===== */
input[type="range"].roi-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: var(--border);
    outline: none;
    cursor: pointer;
}

input[type="range"].roi-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-bright);
    cursor: pointer;
    box-shadow: 0 1px 4px var(--shadow);
    transition: transform 0.15s ease;
}

input[type="range"].roi-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
}

input[type="range"].roi-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-bright);
    cursor: pointer;
    border: none;
    box-shadow: 0 1px 4px var(--shadow);
}

input[type="range"].roi-slider::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: var(--border);
}

.roi-assumptions-toggle {
    cursor: pointer;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    font: inherit;
    color: var(--text-muted);
    font-size: 12px;
}

.roi-assumptions-toggle .fa-chevron-down {
    transition: transform 0.2s ease;
    font-size: 9px;
}

.roi-assumptions-toggle.open .fa-chevron-down {
    transform: rotate(180deg);
}

.roi-assumptions-panel {
    display: none;
    margin-top: 12px;
}

.roi-assumptions-panel.open {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.roi-assumption-input {
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    color: var(--text);
    width: 100%;
    font-family: 'IBM Plex Mono', monospace;
}

.roi-assumption-input:focus {
    outline: none;
    border-color: var(--accent-bright);
}

.roi-results-value {
    transition: opacity 0.15s ease;
}

.roi-payback-badge {
    background: var(--success-soft);
    border: 1px solid var(--success-border);
    border-radius: 10px;
    padding: 12px;
    text-align: center;
}

.roi-tier-card {
    background: var(--accent-soft);
    border: 1px solid var(--accent-border);
    border-radius: 10px;
    padding: 14px;
    text-align: center;
}

.roi-negative-state {
    display: none;
}

.roi-negative-state.visible {
    display: block;
}

.roi-positive-state.hidden {
    display: none;
}
```

- [ ] **Step 2: Verify CSS is valid**

Open any existing page in a browser and confirm no visual regressions — the new classes are scoped and won't affect existing elements.

- [ ] **Step 3: Commit**

```bash
git checkout -b feat/roi-calculator
git add styles.css
git commit -m "feat: add ROI calculator CSS — slider styling, assumptions panel, results layout"
```

---

### Task 2: Add ROI calculator HTML section to `pricing.html`

**Files:**
- Modify: `pricing.html:220` (insert new section before the `<!-- ===== TOP-UP PACKS ===== -->` comment on line 220)
- Modify: `pricing.html:28-31` (add anchor link in hero)

- [ ] **Step 1: Add "Calculate Your ROI" anchor link to the hero**

Find the closing `</p>` of the hero subheadline (line ~31) and insert the anchor link after it. In `pricing.html`, after line 31:

```html
            <a href="#roi-calculator" class="btn-secondary inline-flex mt-6" style="font-size: 14px; padding: 10px 20px; border-radius: 10px;">
                Calculate Your ROI <i class="fas fa-arrow-down ml-2 text-xs"></i>
            </a>
```

- [ ] **Step 2: Add the ROI calculator section**

Insert the following before the `<!-- ===== TOP-UP PACKS ===== -->` line (line 220 in `pricing.html`):

```html
    <!-- ===== ROI CALCULATOR ===== -->
    <section id="roi-calculator" class="section-alt border-t divider py-20">
        <div class="max-w-5xl mx-auto px-6">
            <div class="text-center mb-12 fade-up">
                <span class="badge mb-6"><i class="fas fa-calculator text-[10px]"></i> ROI CALCULATOR</span>
                <h2 class="text-3xl md:text-4xl font-extrabold mb-4" style="letter-spacing: -0.03em;">
                    See how much you'd <span class="gradient-text">save</span>
                </h2>
                <p class="text-base max-w-xl mx-auto" style="color: var(--text-secondary);">
                    Compare the cost of building integrations in-house vs using OneHazel.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 fade-up-1">

                <!-- LEFT: Inputs -->
                <div class="card p-8">
                    <h3 class="mono text-[10px] font-semibold uppercase tracking-wider mb-6" style="color: var(--text-muted);">Your Setup</h3>

                    <!-- Slider: Integrations -->
                    <div class="mb-6">
                        <div class="flex justify-between mb-2">
                            <span class="text-sm" style="color: var(--text-secondary);">Vendor integrations needed</span>
                            <span id="roi-integrations-val" class="mono text-sm font-semibold" style="color: var(--accent-bright);">10</span>
                        </div>
                        <input type="range" id="roi-integrations" class="roi-slider" min="1" max="50" value="10" step="1">
                    </div>

                    <!-- Slider: Developers -->
                    <div class="mb-6">
                        <div class="flex justify-between mb-2">
                            <span class="text-sm" style="color: var(--text-secondary);">Developers on integrations</span>
                            <span id="roi-devs-val" class="mono text-sm font-semibold" style="color: var(--accent-bright);">2</span>
                        </div>
                        <input type="range" id="roi-devs" class="roi-slider" min="1" max="20" value="2" step="1">
                    </div>

                    <!-- Slider: Hourly rate -->
                    <div class="mb-6">
                        <div class="flex justify-between mb-2">
                            <span class="text-sm" style="color: var(--text-secondary);">Average developer cost</span>
                            <span id="roi-rate-val" class="mono text-sm font-semibold" style="color: var(--accent-bright);">&euro;85/hr</span>
                        </div>
                        <input type="range" id="roi-rate" class="roi-slider" min="30" max="200" value="85" step="5">
                    </div>

                    <!-- Collapsible assumptions -->
                    <div style="border-top: 1px solid var(--border); padding-top: 16px;">
                        <button class="roi-assumptions-toggle" id="roi-toggle-assumptions">
                            <i class="fas fa-chevron-down"></i> Adjust assumptions
                        </button>
                        <div class="roi-assumptions-panel" id="roi-assumptions">
                            <div>
                                <div class="mono text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Hours to build</div>
                                <input type="number" id="roi-build-hours" class="roi-assumption-input" value="120" min="40" max="300" step="10">
                            </div>
                            <div>
                                <div class="mono text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Maintenance hrs/mo</div>
                                <input type="number" id="roi-maint-hours" class="roi-assumption-input" value="15" min="5" max="40" step="1">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT: Results -->
                <div class="card p-8 flex flex-col justify-center">

                    <!-- Positive state (savings > 0) -->
                    <div id="roi-positive" class="roi-positive-state">
                        <!-- Annual savings -->
                        <div class="text-center mb-6">
                            <div class="mono text-[10px] font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Annual savings</div>
                            <div id="roi-savings" class="text-4xl md:text-5xl font-extrabold gradient-text roi-results-value" style="-webkit-text-fill-color: transparent;">&euro;189,000</div>
                        </div>

                        <!-- Payback period -->
                        <div class="roi-payback-badge mb-6">
                            <div class="mono text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--success);">Payback period</div>
                            <div id="roi-payback" class="text-xl font-extrabold" style="color: var(--success);">1.8 months</div>
                        </div>

                        <!-- Tier recommendation -->
                        <div class="roi-tier-card mb-5">
                            <div class="text-xs mb-1" style="color: var(--text-muted);">Recommended plan</div>
                            <div id="roi-tier-name" class="text-base font-bold mb-0.5" style="color: var(--accent-bright);">Scale &middot; &euro;2,499/mo</div>
                            <div id="roi-tier-founding" class="text-xs" style="color: var(--text-muted);">Founding price: &euro;1,249/mo</div>
                        </div>

                        <a id="roi-cta" href="https://app.onehazel.com" class="btn-primary w-full text-center" style="font-size: 14px; padding: 12px 20px;">
                            Get Started with Scale <span class="ml-2">&rarr;</span>
                        </a>
                    </div>

                    <!-- Negative state (savings <= 0) -->
                    <div id="roi-negative" class="roi-negative-state text-center">
                        <div class="mb-4">
                            <i class="fas fa-comments text-2xl mb-3" style="color: var(--accent-bright);"></i>
                            <p class="text-base font-semibold mb-2">Talk to us about your specific use case</p>
                            <p class="text-sm" style="color: var(--text-secondary);">
                                For smaller integration needs, our team can help find the right plan for your situation.
                            </p>
                        </div>
                        <a href="/contact" class="btn-secondary w-full text-center" style="font-size: 14px; padding: 12px 20px;">
                            Contact Sales <span class="ml-2">&rarr;</span>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </section>

```

- [ ] **Step 3: Verify the HTML renders**

Open `pricing.html` in a browser. Confirm the ROI section appears between the tier cards and top-up packs, and the anchor link in the hero scrolls to it. Sliders won't calculate yet — that's Task 3.

- [ ] **Step 4: Commit**

```bash
git add pricing.html
git commit -m "feat: add ROI calculator HTML section to pricing page with anchor link"
```

---

### Task 3: Add `initROICalculator()` to `main.js`

**Files:**
- Modify: `main.js` (insert new function before the closing `})();` on line 217)

- [ ] **Step 1: Add the calculator function**

Insert before the final `})();` in `main.js`:

```javascript
    // ===== ROI CALCULATOR =====
    function initROICalculator() {
        var integrations = document.getElementById('roi-integrations');
        var devs = document.getElementById('roi-devs');
        var rate = document.getElementById('roi-rate');
        var buildHours = document.getElementById('roi-build-hours');
        var maintHours = document.getElementById('roi-maint-hours');

        if (!integrations || !devs || !rate) return;

        var integrationsVal = document.getElementById('roi-integrations-val');
        var devsVal = document.getElementById('roi-devs-val');
        var rateVal = document.getElementById('roi-rate-val');
        var savingsEl = document.getElementById('roi-savings');
        var paybackEl = document.getElementById('roi-payback');
        var tierNameEl = document.getElementById('roi-tier-name');
        var tierFoundingEl = document.getElementById('roi-tier-founding');
        var ctaEl = document.getElementById('roi-cta');
        var positiveEl = document.getElementById('roi-positive');
        var negativeEl = document.getElementById('roi-negative');

        var toggleBtn = document.getElementById('roi-toggle-assumptions');
        var assumptionsPanel = document.getElementById('roi-assumptions');

        if (toggleBtn && assumptionsPanel) {
            toggleBtn.addEventListener('click', function () {
                toggleBtn.classList.toggle('open');
                assumptionsPanel.classList.toggle('open');
            });
        }

        var fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

        var tiers = {
            grow:       { max: 5,  tierName: 'Grow',       annual: 999,  monthly: 1199, foundingAnnual: 499,  foundingMonthly: 749  },
            scale:      { max: 20, tierName: 'Scale',      annual: 2499, monthly: 2999, foundingAnnual: 1249, foundingMonthly: 1899 },
            enterprise: { max: 50, tierName: 'Enterprise', annual: 2499, monthly: 2999, foundingAnnual: 1249, foundingMonthly: 1899 }
        };

        function getBilling() {
            var container = document.getElementById('pricing-container');
            if (container && container.classList.contains('billing-monthly')) return 'monthly';
            return 'annual';
        }

        function getTier(count) {
            if (count <= tiers.grow.max) return tiers.grow;
            if (count <= tiers.scale.max) return tiers.scale;
            return tiers.enterprise;
        }

        function calculate() {
            var n = parseInt(integrations.value, 10);
            var r = parseInt(rate.value, 10);
            var bh = parseInt(buildHours.value, 10);
            var mh = parseInt(maintHours.value, 10);

            integrationsVal.textContent = n;
            devsVal.textContent = parseInt(devs.value, 10);
            rateVal.textContent = '\u20AC' + r + '/hr';

            var buildCost = n * bh * r;
            var maintenanceCost = n * mh * r * 12;
            var totalInHouse = buildCost + maintenanceCost;

            var billing = getBilling();
            var tier = getTier(n);
            var monthlyPrice = billing === 'annual' ? tier.annual : tier.monthly;
            var oneHazelAnnual = monthlyPrice * 12;
            var annualSavings = totalInHouse - oneHazelAnnual;

            if (annualSavings <= 0) {
                positiveEl.classList.add('hidden');
                negativeEl.classList.add('visible');
                return;
            }

            positiveEl.classList.remove('hidden');
            negativeEl.classList.remove('visible');

            // Security: innerHTML is safe here — content is hardcoded static HTML
            // (tier names + arrow entity), no user input is interpolated.
            /* eslint-disable no-unsanitized/property */
            savingsEl.textContent = fmt.format(annualSavings);

            var paybackMonths = oneHazelAnnual / (totalInHouse / 12);
            var paybackText;
            if (paybackMonths < 1) paybackText = '< 1 month';
            else if (paybackMonths > 12) paybackText = '12+ months';
            else paybackText = paybackMonths.toFixed(1) + ' months';
            paybackEl.textContent = paybackText;

            var foundingPrice = billing === 'annual' ? tier.foundingAnnual : tier.foundingMonthly;
            var isEnterprise = tier.tierName === 'Enterprise';

            tierNameEl.textContent = tier.tierName + ' \u00B7 ' + fmt.format(monthlyPrice) + '/mo';
            tierFoundingEl.textContent = isEnterprise ? 'Annual commitment' : 'Founding price: ' + fmt.format(foundingPrice) + '/mo';

            if (isEnterprise) {
                ctaEl.href = '/contact';
                ctaEl.textContent = 'Contact Sales \u2192';
            } else {
                ctaEl.href = 'https://app.onehazel.com';
                ctaEl.textContent = 'Get Started with ' + tier.tierName + ' \u2192';
            }
        }

        [integrations, devs, rate].forEach(function (slider) {
            slider.addEventListener('input', calculate);
        });

        [buildHours, maintHours].forEach(function (input) {
            if (input) input.addEventListener('input', calculate);
        });

        // Recalculate when billing toggle changes
        if (pricingContainer) {
            var billingBtnsROI = pricingContainer.querySelectorAll('.billing-btn');
            billingBtnsROI.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    setTimeout(calculate, 10);
                });
            });
        }

        calculate();
    }

    initROICalculator();
```

- [ ] **Step 2: Test the calculator**

Open `pricing.html` in a browser:
1. Confirm sliders update the displayed values live
2. Drag integrations to 15, devs to 3, rate stays 85 — expect savings around €225k
3. Toggle billing to monthly — savings number should decrease
4. Drag integrations down to 1 with rate at 30 — should show the "Talk to us" state
5. Click "Adjust assumptions" — panel should expand, editing hours should recalculate
6. Click the hero anchor link — should smooth-scroll to the calculator

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add initROICalculator() — live savings, payback, tier recommendation"
```

---

### Task 4: Add `roi-calculator.module` to HubSpot theme

**Files:**
- Create: `onehazel-theme/modules/roi-calculator.module/meta.json`
- Create: `onehazel-theme/modules/roi-calculator.module/fields.json`
- Create: `onehazel-theme/modules/roi-calculator.module/module.html`

- [ ] **Step 1: Create `meta.json`**

Create `onehazel-theme/modules/roi-calculator.module/meta.json`:

```json
{
  "label": "ROI Calculator",
  "css_assets": [],
  "js_assets": [],
  "other_assets": [],
  "smart_type": "NOT_SMART",
  "tags": ["calculator", "pricing"],
  "is_available_for_new_content": false
}
```

- [ ] **Step 2: Create `fields.json`**

Create `onehazel-theme/modules/roi-calculator.module/fields.json`:

```json
[
  {
    "id": "section_heading",
    "name": "section_heading",
    "label": "Heading",
    "type": "text",
    "default": "See how much you'd save"
  },
  {
    "id": "section_subheading",
    "name": "section_subheading",
    "label": "Subheading",
    "type": "text",
    "default": "Compare the cost of building integrations in-house vs using OneHazel."
  },
  {
    "id": "default_integrations",
    "name": "default_integrations",
    "label": "Default: Integrations",
    "type": "number",
    "default": 10
  },
  {
    "id": "default_devs",
    "name": "default_devs",
    "label": "Default: Developers",
    "type": "number",
    "default": 2
  },
  {
    "id": "default_rate",
    "name": "default_rate",
    "label": "Default: Hourly Rate (EUR)",
    "type": "number",
    "default": 85
  },
  {
    "id": "default_build_hours",
    "name": "default_build_hours",
    "label": "Default: Hours to Build",
    "type": "number",
    "default": 120
  },
  {
    "id": "default_maint_hours",
    "name": "default_maint_hours",
    "label": "Default: Maintenance Hrs/Mo",
    "type": "number",
    "default": 15
  },
  {
    "id": "grow_annual",
    "name": "grow_annual",
    "label": "Grow: Annual Price/Mo",
    "type": "number",
    "default": 999
  },
  {
    "id": "grow_monthly",
    "name": "grow_monthly",
    "label": "Grow: Monthly Price/Mo",
    "type": "number",
    "default": 1199
  },
  {
    "id": "grow_founding_annual",
    "name": "grow_founding_annual",
    "label": "Grow: Founding Annual/Mo",
    "type": "number",
    "default": 499
  },
  {
    "id": "grow_founding_monthly",
    "name": "grow_founding_monthly",
    "label": "Grow: Founding Monthly/Mo",
    "type": "number",
    "default": 749
  },
  {
    "id": "scale_annual",
    "name": "scale_annual",
    "label": "Scale: Annual Price/Mo",
    "type": "number",
    "default": 2499
  },
  {
    "id": "scale_monthly",
    "name": "scale_monthly",
    "label": "Scale: Monthly Price/Mo",
    "type": "number",
    "default": 2999
  },
  {
    "id": "scale_founding_annual",
    "name": "scale_founding_annual",
    "label": "Scale: Founding Annual/Mo",
    "type": "number",
    "default": 1249
  },
  {
    "id": "scale_founding_monthly",
    "name": "scale_founding_monthly",
    "label": "Scale: Founding Monthly/Mo",
    "type": "number",
    "default": 1899
  }
]
```

- [ ] **Step 3: Create `module.html`**

Create `onehazel-theme/modules/roi-calculator.module/module.html`:

```html
{# ROI Calculator — mirrors pricing.html GitHub Pages version #}

<div class="text-center mb-12 fade-up">
    <span class="badge mb-6"><i class="fas fa-calculator text-[10px]"></i> ROI CALCULATOR</span>
    <h2 class="text-3xl md:text-4xl font-extrabold mb-4" style="letter-spacing: -0.03em;">
        See how much you'd <span class="gradient-text">save</span>
    </h2>
    <p class="text-base max-w-xl mx-auto" style="color: var(--text-secondary);">
        {{ module.section_subheading }}
    </p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 fade-up-1">

    {# LEFT: Inputs #}
    <div class="card p-8">
        <h3 class="mono text-[10px] font-semibold uppercase tracking-wider mb-6" style="color: var(--text-muted);">Your Setup</h3>

        <div class="mb-6">
            <div class="flex justify-between mb-2">
                <span class="text-sm" style="color: var(--text-secondary);">Vendor integrations needed</span>
                <span id="roi-integrations-val" class="mono text-sm font-semibold" style="color: var(--accent-bright);">{{ module.default_integrations }}</span>
            </div>
            <input type="range" id="roi-integrations" class="roi-slider" min="1" max="50" value="{{ module.default_integrations }}" step="1">
        </div>

        <div class="mb-6">
            <div class="flex justify-between mb-2">
                <span class="text-sm" style="color: var(--text-secondary);">Developers on integrations</span>
                <span id="roi-devs-val" class="mono text-sm font-semibold" style="color: var(--accent-bright);">{{ module.default_devs }}</span>
            </div>
            <input type="range" id="roi-devs" class="roi-slider" min="1" max="20" value="{{ module.default_devs }}" step="1">
        </div>

        <div class="mb-6">
            <div class="flex justify-between mb-2">
                <span class="text-sm" style="color: var(--text-secondary);">Average developer cost</span>
                <span id="roi-rate-val" class="mono text-sm font-semibold" style="color: var(--accent-bright);">&euro;{{ module.default_rate }}/hr</span>
            </div>
            <input type="range" id="roi-rate" class="roi-slider" min="30" max="200" value="{{ module.default_rate }}" step="5">
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 16px;">
            <button class="roi-assumptions-toggle" id="roi-toggle-assumptions">
                <i class="fas fa-chevron-down"></i> Adjust assumptions
            </button>
            <div class="roi-assumptions-panel" id="roi-assumptions">
                <div>
                    <div class="mono text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Hours to build</div>
                    <input type="number" id="roi-build-hours" class="roi-assumption-input" value="{{ module.default_build_hours }}" min="40" max="300" step="10">
                </div>
                <div>
                    <div class="mono text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--text-muted);">Maintenance hrs/mo</div>
                    <input type="number" id="roi-maint-hours" class="roi-assumption-input" value="{{ module.default_maint_hours }}" min="5" max="40" step="1">
                </div>
            </div>
        </div>
    </div>

    {# RIGHT: Results #}
    <div class="card p-8 flex flex-col justify-center">
        <div id="roi-positive" class="roi-positive-state">
            <div class="text-center mb-6">
                <div class="mono text-[10px] font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Annual savings</div>
                <div id="roi-savings" class="text-4xl md:text-5xl font-extrabold gradient-text roi-results-value" style="-webkit-text-fill-color: transparent;">&euro;189,000</div>
            </div>
            <div class="roi-payback-badge mb-6">
                <div class="mono text-[10px] font-semibold uppercase tracking-wider mb-1" style="color: var(--success);">Payback period</div>
                <div id="roi-payback" class="text-xl font-extrabold" style="color: var(--success);">1.8 months</div>
            </div>
            <div class="roi-tier-card mb-5">
                <div class="text-xs mb-1" style="color: var(--text-muted);">Recommended plan</div>
                <div id="roi-tier-name" class="text-base font-bold mb-0.5" style="color: var(--accent-bright);">Scale &middot; &euro;2,499/mo</div>
                <div id="roi-tier-founding" class="text-xs" style="color: var(--text-muted);">Founding price: &euro;1,249/mo</div>
            </div>
            <a id="roi-cta" href="https://app.onehazel.com" class="btn-primary w-full text-center" style="font-size: 14px; padding: 12px 20px;">
                Get Started with Scale <span class="ml-2">&rarr;</span>
            </a>
        </div>
        <div id="roi-negative" class="roi-negative-state text-center">
            <div class="mb-4">
                <i class="fas fa-comments text-2xl mb-3" style="color: var(--accent-bright);"></i>
                <p class="text-base font-semibold mb-2">Talk to us about your specific use case</p>
                <p class="text-sm" style="color: var(--text-secondary);">For smaller integration needs, our team can help find the right plan for your situation.</p>
            </div>
            <a href="/contact" class="btn-secondary w-full text-center" style="font-size: 14px; padding: 12px 20px;">
                Contact Sales <span class="ml-2">&rarr;</span>
            </a>
        </div>
    </div>
</div>

{% require_js position="footer" %}
<script>
(function() {
    var integrations = document.getElementById('roi-integrations');
    var devs = document.getElementById('roi-devs');
    var rate = document.getElementById('roi-rate');
    var buildHours = document.getElementById('roi-build-hours');
    var maintHours = document.getElementById('roi-maint-hours');
    if (!integrations || !devs || !rate) return;

    var integrationsVal = document.getElementById('roi-integrations-val');
    var devsVal = document.getElementById('roi-devs-val');
    var rateVal = document.getElementById('roi-rate-val');
    var savingsEl = document.getElementById('roi-savings');
    var paybackEl = document.getElementById('roi-payback');
    var tierNameEl = document.getElementById('roi-tier-name');
    var tierFoundingEl = document.getElementById('roi-tier-founding');
    var ctaEl = document.getElementById('roi-cta');
    var positiveEl = document.getElementById('roi-positive');
    var negativeEl = document.getElementById('roi-negative');

    var toggleBtn = document.getElementById('roi-toggle-assumptions');
    var assumptionsPanel = document.getElementById('roi-assumptions');
    if (toggleBtn && assumptionsPanel) {
        toggleBtn.addEventListener('click', function() {
            toggleBtn.classList.toggle('open');
            assumptionsPanel.classList.toggle('open');
        });
    }

    var fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

    var tiers = {
        grow:       { max: 5,  tierName: 'Grow',       annual: {{ module.grow_annual }},  monthly: {{ module.grow_monthly }},  foundingAnnual: {{ module.grow_founding_annual }},  foundingMonthly: {{ module.grow_founding_monthly }}  },
        scale:      { max: 20, tierName: 'Scale',      annual: {{ module.scale_annual }}, monthly: {{ module.scale_monthly }}, foundingAnnual: {{ module.scale_founding_annual }}, foundingMonthly: {{ module.scale_founding_monthly }} },
        enterprise: { max: 50, tierName: 'Enterprise', annual: {{ module.scale_annual }}, monthly: {{ module.scale_monthly }}, foundingAnnual: {{ module.scale_founding_annual }}, foundingMonthly: {{ module.scale_founding_monthly }} }
    };

    function getBilling() {
        var container = document.getElementById('pricing-container');
        if (container && container.classList.contains('billing-monthly')) return 'monthly';
        return 'annual';
    }

    function getTier(count) {
        if (count <= tiers.grow.max) return tiers.grow;
        if (count <= tiers.scale.max) return tiers.scale;
        return tiers.enterprise;
    }

    function calculate() {
        var n = parseInt(integrations.value, 10);
        var r = parseInt(rate.value, 10);
        var bh = parseInt(buildHours.value, 10);
        var mh = parseInt(maintHours.value, 10);

        integrationsVal.textContent = n;
        devsVal.textContent = parseInt(devs.value, 10);
        rateVal.textContent = '\u20AC' + r + '/hr';

        var buildCost = n * bh * r;
        var maintenanceCost = n * mh * r * 12;
        var totalInHouse = buildCost + maintenanceCost;

        var billing = getBilling();
        var tier = getTier(n);
        var monthlyPrice = billing === 'annual' ? tier.annual : tier.monthly;
        var oneHazelAnnual = monthlyPrice * 12;
        var annualSavings = totalInHouse - oneHazelAnnual;

        if (annualSavings <= 0) {
            positiveEl.classList.add('hidden');
            negativeEl.classList.add('visible');
            return;
        }

        positiveEl.classList.remove('hidden');
        negativeEl.classList.remove('visible');

        savingsEl.textContent = fmt.format(annualSavings);

        var paybackMonths = oneHazelAnnual / (totalInHouse / 12);
        var paybackText;
        if (paybackMonths < 1) paybackText = '< 1 month';
        else if (paybackMonths > 12) paybackText = '12+ months';
        else paybackText = paybackMonths.toFixed(1) + ' months';
        paybackEl.textContent = paybackText;

        var foundingPrice = billing === 'annual' ? tier.foundingAnnual : tier.foundingMonthly;
        var isEnterprise = tier.tierName === 'Enterprise';

        tierNameEl.textContent = tier.tierName + ' \u00B7 ' + fmt.format(monthlyPrice) + '/mo';
        tierFoundingEl.textContent = isEnterprise ? 'Annual commitment' : 'Founding price: ' + fmt.format(foundingPrice) + '/mo';

        if (isEnterprise) {
            ctaEl.href = '/contact';
            ctaEl.textContent = 'Contact Sales \u2192';
        } else {
            ctaEl.href = 'https://app.onehazel.com';
            ctaEl.textContent = 'Get Started with ' + tier.tierName + ' \u2192';
        }
    }

    [integrations, devs, rate].forEach(function(s) { s.addEventListener('input', calculate); });
    [buildHours, maintHours].forEach(function(i) { if (i) i.addEventListener('input', calculate); });

    var container = document.getElementById('pricing-container');
    if (container) {
        container.querySelectorAll('.billing-btn').forEach(function(btn) {
            btn.addEventListener('click', function() { setTimeout(calculate, 10); });
        });
    }

    calculate();
})();
</script>
{% end_require_js %}
```

- [ ] **Step 4: Commit**

```bash
git add onehazel-theme/modules/roi-calculator.module/
git commit -m "feat: add roi-calculator HubSpot DnD module with editable defaults"
```

---

### Task 5: Wire ROI module into HubSpot pricing template

**Files:**
- Modify: `onehazel-theme/templates/pricing.html:18` (add anchor link after hero subheading)
- Modify: `onehazel-theme/templates/pricing.html:183` (add DnD area before top-up packs)

- [ ] **Step 1: Add anchor link to HubSpot pricing hero**

In `onehazel-theme/templates/pricing.html`, after line 18 (closing `</p>` of the hero subheadline), add:

```html
        <a href="#roi-calculator" class="btn-secondary inline-flex mt-6" style="font-size: 14px; padding: 10px 20px; border-radius: 10px;">
            Calculate Your ROI <i class="fas fa-arrow-down ml-2 text-xs"></i>
        </a>
```

- [ ] **Step 2: Add the DnD area**

In `onehazel-theme/templates/pricing.html`, insert the following before the `<!-- ===== TOP-UP PACKS ===== -->` comment (line 183):

```html
<!-- ===== ROI CALCULATOR ===== -->
<section id="roi-calculator" class="section-alt border-t divider py-20">
    <div class="max-w-5xl mx-auto px-6">
        {% dnd_area "roi_calculator" label="ROI Calculator" %}
            {% dnd_module path="onehazel-theme/modules/roi-calculator.module" %}
            {% end_dnd_module %}
        {% end_dnd_area %}
    </div>
</section>

```

- [ ] **Step 3: Commit**

```bash
git add onehazel-theme/templates/pricing.html
git commit -m "feat: wire roi-calculator module into HubSpot pricing template"
```

---

### Task 6: Add smooth scroll and test end-to-end

**Files:**
- Modify: `styles.css` (add `scroll-behavior: smooth` if not present)

- [ ] **Step 1: Add smooth scroll to `styles.css`**

Check if `html { scroll-behavior: smooth; }` already exists. If not, add near the top after the `:root` block:

```css
html {
    scroll-behavior: smooth;
}
```

- [ ] **Step 2: End-to-end test on GitHub Pages version**

Open `pricing.html` in browser and verify:

1. Hero shows "Calculate Your ROI" button — clicking it smooth-scrolls to `#roi-calculator`
2. Three sliders work — values update live beside each slider
3. Results panel shows savings and payback period
4. With defaults (10 integrations, 2 devs, €85/hr, 120 build hrs, 15 maint hrs):
   - In-house: (10 x 120 x 85) + (10 x 15 x 85 x 12) = 102,000 + 153,000 = €255,000
   - Scale annual: 2,499 x 12 = €29,988
   - Savings: €225,012
   - Payback: 29,988 / (255,000 / 12) = 1.4 months
5. Toggle billing to monthly — prices and savings change
6. Set integrations to 1, rate to 30 — should show "Talk to us" state
7. Set integrations to 25 — tier switches to Enterprise, CTA says "Contact Sales"
8. "Adjust assumptions" expands/collapses, changing values recalculates
9. Mobile (resize to <768px) — stacks vertically, sliders full-width
10. Dark mode toggle — all elements use CSS vars, no hardcoded colours

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add smooth scroll for ROI anchor link"
```

---

### Task 7: Final commit and PR

- [ ] **Step 1: Push branch and create PR**

```bash
git push -u origin feat/roi-calculator
gh pr create --title "feat: ROI calculator on pricing page" --body "$(cat <<'EOF'
## Summary
- Inline ROI calculator between pricing tiers and top-up packs
- 3 sliders (integrations, devs, hourly rate) + collapsible assumptions panel
- Live-updating savings, payback period, and tier recommendation
- "Calculate Your ROI" anchor link in hero
- HubSpot DnD module with editable defaults for marketing
- Responsive, dark mode compatible

## Test plan
- [ ] Verify default calculation matches expected values
- [ ] Toggle billing annual/monthly — results update
- [ ] Drag integrations to 1 with low rate — negative state shows
- [ ] Drag integrations to 25+ — Enterprise tier, Contact Sales CTA
- [ ] Adjust assumptions panel expands/collapses and recalculates
- [ ] Mobile responsive — stacks vertically
- [ ] Dark mode — all elements themed correctly
- [ ] Hero anchor link smooth-scrolls to calculator
- [ ] HubSpot module renders with correct defaults

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
