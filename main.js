/**
 * OneHazel — shared site JS
 * Nav injection, theme toggle, mobile menu, billing toggle, sector decorations
 */
(function () {
    var html = document.documentElement;

    // ===== REUSABLE NAV (edit once, updates all pages) =====
    // Security: innerHTML is safe here — content is 100% hardcoded static HTML,
    // no user input or external data is interpolated.
    function renderNav() {
        var el = document.getElementById('site-nav');
        if (!el) return;
        /* eslint-disable no-unsanitized/property */
        el.innerHTML = /* static nav HTML — no user input */
            '<nav class="w-full py-4 px-6 md:px-8 flex justify-between items-center max-w-7xl mx-auto border-b divider">' +
                '<a href="/" class="font-extrabold text-xl tracking-tight" style="color: var(--text); letter-spacing: -0.02em; text-decoration: none;">' +
                    '<span class="gradient-text" style="-webkit-text-fill-color: transparent;">ONE</span>' +
                    '<span style="letter-spacing: -0.04em;">HAZEL</span> ' +
                    '<span class="font-normal hidden sm:inline" style="color: var(--text-muted);">/ Elevate AI</span>' +
                '</a>' +
                '<div class="hidden md:flex items-center gap-5 text-sm font-medium" style="color: var(--text-secondary);">' +
                    '<div class="relative nav-dropdown-trigger">' +
                        '<button class="flex items-center gap-1.5 hover:opacity-70 transition py-2" style="color: var(--text-secondary); background: none; border: none; cursor: pointer; font: inherit;">' +
                            'Industries <i class="fas fa-chevron-down text-[9px]" style="color: var(--text-muted);"></i>' +
                        '</button>' +
                        '<div class="nav-dropdown">' +
                            '<a href="/igaming"><i class="fas fa-dice text-emerald-500 w-4 text-center"></i> iGaming</a>' +
                            '<a href="/healthcare"><i class="fas fa-heartbeat text-cyan-500 w-4 text-center"></i> Healthcare</a>' +
                            '<a href="/construction"><i class="fas fa-hard-hat text-amber-500 w-4 text-center"></i> Construction</a>' +
                            '<a href="/cannabis"><i class="fas fa-leaf text-lime-500 w-4 text-center"></i> Cannabis</a>' +
                            '<a href="/lifesciences"><i class="fas fa-flask text-violet-500 w-4 text-center"></i> Life Sciences</a>' +
                            '<a href="/energy"><i class="fas fa-bolt text-yellow-500 w-4 text-center"></i> Energy &amp; Utilities</a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="relative nav-dropdown-trigger">' +
                        '<button class="flex items-center gap-1.5 hover:opacity-70 transition py-2" style="color: var(--text-secondary); background: none; border: none; cursor: pointer; font: inherit;">' +
                            'Pricing <i class="fas fa-chevron-down text-[9px]" style="color: var(--text-muted);"></i>' +
                        '</button>' +
                        '<div class="nav-dropdown">' +
                            '<a href="/pricing"><i class="fas fa-building text-amber-500 w-4 text-center"></i> For Operators</a>' +
                            '<a href="/vendors"><i class="fas fa-store text-emerald-500 w-4 text-center"></i> For Vendors</a>' +
                            '<a href="/platform-providers"><i class="fas fa-sitemap text-blue-500 w-4 text-center"></i> For Platform Providers</a>' +
                        '</div>' +
                    '</div>' +
                    '<a href="/about" class="hover:opacity-70 transition" style="color: var(--text-secondary); text-decoration: none;">About</a>' +
                    '<a href="/contact" class="hover:opacity-70 transition" style="color: var(--text-secondary); text-decoration: none;">Contact</a>' +
                '</div>' +
                '<div class="flex items-center gap-3">' +
                    '<button id="theme-toggle" class="theme-toggle hidden md:flex" aria-label="Toggle dark mode">' +
                        '<i class="fas fa-sun icon-sun"></i>' +
                        '<i class="fas fa-moon icon-moon"></i>' +
                    '</button>' +
                    '<a href="https://app.onehazel.com" class="btn-primary hidden md:inline-flex" style="padding: 8px 18px; font-size: 13px; border-radius: 8px;">' +
                        'Sign up to BETA <i class="fas fa-arrow-right ml-2 text-xs"></i>' +
                    '</a>' +
                    '<button id="burger-btn" class="burger-btn" aria-label="Open menu">' +
                        '<i class="fas fa-bars"></i>' +
                    '</button>' +
                '</div>' +
            '</nav>' +
            '<div id="mobile-menu" class="mobile-menu" aria-hidden="true">' +
                '<div class="flex justify-between items-center mb-4">' +
                    '<a href="/" class="font-extrabold text-xl tracking-tight" style="color: var(--text); letter-spacing: -0.02em; text-decoration: none;">' +
                        '<span class="gradient-text" style="-webkit-text-fill-color: transparent;">ONE</span>' +
                        '<span style="letter-spacing: -0.04em;">HAZEL</span>' +
                    '</a>' +
                    '<button id="mobile-menu-close" class="burger-btn" style="display: flex;" aria-label="Close menu">' +
                        '<i class="fas fa-times"></i>' +
                    '</button>' +
                '</div>' +
                '<div class="flex-1 overflow-y-auto">' +
                    '<div class="mobile-menu-section">Industries</div>' +
                    '<a href="/igaming"><i class="fas fa-dice text-emerald-500 w-5 text-center"></i> iGaming</a>' +
                    '<a href="/healthcare"><i class="fas fa-heartbeat text-cyan-500 w-5 text-center"></i> Healthcare</a>' +
                    '<a href="/construction"><i class="fas fa-hard-hat text-amber-500 w-5 text-center"></i> Construction</a>' +
                    '<a href="/cannabis"><i class="fas fa-leaf text-lime-500 w-5 text-center"></i> Cannabis</a>' +
                    '<a href="/lifesciences"><i class="fas fa-flask text-violet-500 w-5 text-center"></i> Life Sciences</a>' +
                    '<a href="/energy"><i class="fas fa-bolt text-yellow-500 w-5 text-center"></i> Energy &amp; Utilities</a>' +
                    '<div class="mobile-menu-section">Pricing</div>' +
                    '<a href="/pricing"><i class="fas fa-building text-amber-500 w-5 text-center"></i> For Operators</a>' +
                    '<a href="/vendors"><i class="fas fa-store text-emerald-500 w-5 text-center"></i> For Vendors</a>' +
                    '<a href="/platform-providers"><i class="fas fa-sitemap text-blue-500 w-5 text-center"></i> For Platform Providers</a>' +
                    '<div class="mobile-menu-section">Pages</div>' +
                    '<a href="/about"><i class="fas fa-info-circle w-5 text-center" style="color: var(--accent-bright);"></i> About</a>' +
                    '<a href="/contact"><i class="fas fa-envelope w-5 text-center" style="color: var(--accent-bright);"></i> Contact</a>' +
                    '<div class="mobile-menu-section">Theme</div>' +
                    '<a href="#" id="mobile-theme-toggle" onclick="return false;"><i class="fas fa-sun icon-sun w-5 text-center" style="color: var(--accent-bright);"></i><i class="fas fa-moon icon-moon w-5 text-center" style="color: var(--accent-bright);"></i> Toggle Dark Mode</a>' +
                '</div>' +
                '<div class="pt-4 mt-4" style="border-top: 1px solid var(--border);">' +
                    '<a href="https://app.onehazel.com" class="btn-primary w-full text-center" style="text-decoration: none;">' +
                        'Sign up to BETA <i class="fas fa-arrow-right ml-2 text-xs"></i>' +
                    '</a>' +
                '</div>' +
            '</div>';
    }

    renderNav();

    // ===== THEME TOGGLE =====
    var toggle = document.getElementById('theme-toggle');
    function setTheme(t) {
        if (t === 'dark') html.classList.add('dark');
        else html.classList.remove('dark');
        localStorage.setItem('onehazel-theme', t);
    }
    var stored = localStorage.getItem('onehazel-theme');
    if (stored) setTheme(stored);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    if (toggle) {
        toggle.addEventListener('click', function () {
            setTheme(html.classList.contains('dark') ? 'light' : 'dark');
        });
    }

    // ===== MOBILE MENU =====
    var burger = document.getElementById('burger-btn');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileClose = document.getElementById('mobile-menu-close');
    var mobileTheme = document.getElementById('mobile-theme-toggle');

    function openMenu() {
        if (mobileMenu) {
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (burger) burger.addEventListener('click', openMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    if (mobileTheme) {
        mobileTheme.addEventListener('click', function () {
            setTheme(html.classList.contains('dark') ? 'light' : 'dark');
        });
    }

    // Close menu on link click (navigation)
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a[href]:not([onclick])').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
    }

    // ===== PRICING BILLING TOGGLE =====
    var pricingContainer = document.getElementById('pricing-container');
    if (pricingContainer) {
        var billingBtns = pricingContainer.querySelectorAll('.billing-btn');
        pricingContainer.classList.add('billing-annual');
        billingBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var billing = btn.dataset.billing;
                pricingContainer.classList.remove('billing-annual', 'billing-monthly');
                pricingContainer.classList.add('billing-' + billing);
                billingBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
            });
        });
    }

    // ===== SECTOR BACKGROUND DECORATIONS =====
    var sector = html.dataset.sector || 'default';

    var iconSets = {
        default:      ['fa-microchip','fa-server','fa-code','fa-database','fa-bolt','fa-wifi','fa-cloud','fa-cogs','fa-terminal','fa-laptop-code'],
        igaming:      ['fa-dice','fa-chess','fa-coins','fa-trophy','fa-star','fa-gem','fa-crown','fa-gamepad','fa-chess-knight','fa-ticket'],
        healthcare:   ['fa-heartbeat','fa-stethoscope','fa-pills','fa-syringe','fa-hospital','fa-medkit','fa-thermometer-half','fa-user-md','fa-lungs','fa-dna'],
        construction: ['fa-hard-hat','fa-hammer','fa-ruler-combined','fa-truck','fa-drafting-compass','fa-warehouse','fa-tools','fa-wrench','fa-tape','fa-pencil-ruler'],
        cannabis:     ['fa-leaf','fa-seedling','fa-flask','fa-vial','fa-mortar-pestle','fa-prescription-bottle','fa-weight-hanging','fa-tint','fa-spa','fa-pagelines'],
        lifesciences: ['fa-dna','fa-microscope','fa-atom','fa-flask','fa-vials','fa-brain','fa-eye-dropper','fa-biohazard','fa-tablets','fa-syringe'],
        energy:       ['fa-bolt','fa-solar-panel','fa-wind','fa-plug','fa-car-battery','fa-charging-station','fa-fire','fa-lightbulb','fa-tachometer-alt','fa-industry']
    };

    // Deterministic scattered positions for 8 icons
    var positions = [
        { top: '6%',  left: '4%',   rotate: -12, size: 52 },
        { top: '12%', right: '6%',  rotate: 18,  size: 38 },
        { top: '30%', left: '8%',   rotate: 25,  size: 44 },
        { top: '45%', right: '3%',  rotate: -20, size: 56 },
        { top: '58%', left: '2%',   rotate: 8,   size: 36 },
        { top: '72%', right: '10%', rotate: -30, size: 48 },
        { top: '82%', left: '6%',   rotate: 15,  size: 42 },
        { top: '90%', right: '4%',  rotate: -8,  size: 34 }
    ];

    var icons = iconSets[sector] || iconSets['default'];

    document.querySelectorAll('.section-alt').forEach(function (section) {
        var deco = document.createElement('div');
        deco.className = 'section-icons';
        deco.setAttribute('aria-hidden', 'true');

        for (var i = 0; i < 8; i++) {
            var el = document.createElement('i');
            var iconName = icons[i % icons.length];
            el.className = (iconName === 'fa-pagelines' ? 'fab' : 'fas') + ' ' + iconName;
            var p = positions[i];
            var style = 'position:absolute;pointer-events:none;';
            style += 'font-size:' + p.size + 'px;';
            style += 'transform:rotate(' + p.rotate + 'deg);';
            style += 'top:' + p.top + ';';
            style += p.left ? ('left:' + p.left + ';') : ('right:' + p.right + ';');
            el.style.cssText = style;
            deco.appendChild(el);
        }

        section.insertBefore(deco, section.firstChild);
    });

    // ===== ROI CALCULATOR =====
    function initROICalculator() {
        // In-house sliders
        var integrations = document.getElementById('roi-integrations');
        var rate = document.getElementById('roi-rate');
        var buildHours = document.getElementById('roi-build-hours');
        var maintHours = document.getElementById('roi-maint-hours');
        // Usage sliders
        var apiSlider = document.getElementById('roi-api');
        var aiSlider = document.getElementById('roi-ai');
        var privateSlider = document.getElementById('roi-private');

        if (!integrations || !apiSlider) return;

        // Display elements
        var integrationsVal = document.getElementById('roi-integrations-val');
        var rateVal = document.getElementById('roi-rate-val');
        var buildHoursVal = document.getElementById('roi-build-hours-val');
        var maintHoursVal = document.getElementById('roi-maint-hours-val');
        var apiVal = document.getElementById('roi-api-val');
        var aiVal = document.getElementById('roi-ai-val');
        var privateVal = document.getElementById('roi-private-val');
        var inhouseEl = document.getElementById('roi-inhouse');
        var ohCostEl = document.getElementById('roi-oh-cost');
        var ohBreakdownEl = document.getElementById('roi-oh-breakdown');
        var savingsEl = document.getElementById('roi-savings');
        var paybackEl = document.getElementById('roi-payback');
        var ctaEl = document.getElementById('roi-cta');

        var fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

        function fmtCalls(n) {
            if (n >= 1000000) {
                var m = n / 1000000;
                return (m % 1 === 0 ? m : m.toFixed(1)) + 'M';
            }
            return (n / 1000) + 'K';
        }

        // Tier definitions: included allowances
        var tiers = [
            { name: 'Grow',  monthly: 999,  api: 500000,  ai: 500,  priv: 3  },
            { name: 'Scale', monthly: 2499, api: 2000000, ai: 2000, priv: 10 }
        ];

        // Top-up pack costs (greedy: largest first for best value)
        function apiPackCost(excessPerMonth) {
            if (excessPerMonth <= 0) return 0;
            var annual = excessPerMonth * 12;
            var cost = 0;
            while (annual >= 5000000) { cost += 799; annual -= 5000000; }
            while (annual >= 1000000) { cost += 199; annual -= 1000000; }
            while (annual >= 500000)  { cost += 119; annual -= 500000; }
            while (annual > 0)        { cost += 29;  annual -= 100000; }
            return cost;
        }

        function aiPackCost(excessPerMonth) {
            if (excessPerMonth <= 0) return 0;
            var annual = excessPerMonth * 12;
            var cost = 0;
            while (annual >= 5000) { cost += 1999; annual -= 5000; }
            while (annual >= 1000) { cost += 499;  annual -= 1000; }
            while (annual >= 500)  { cost += 299;  annual -= 500; }
            while (annual > 0)     { cost += 79;   annual -= 100; }
            return cost;
        }

        function privatePackCost(excess) {
            if (excess <= 0) return 0;
            var mo = 0;
            var rem = excess;
            while (rem >= 10) { mo += 799; rem -= 10; }
            while (rem >= 5)  { mo += 499; rem -= 5; }
            while (rem >= 3)  { mo += 349; rem -= 3; }
            while (rem > 0)   { mo += 149; rem -= 1; }
            return mo * 12;
        }

        function tierCost(tier, apiNeed, aiNeed, privNeed) {
            var tierAnnual = tier.monthly * 12;
            var packs = apiPackCost(Math.max(0, apiNeed - tier.api))
                      + aiPackCost(Math.max(0, aiNeed - tier.ai))
                      + privatePackCost(Math.max(0, privNeed - tier.priv));
            return { name: tier.name, tierMonthly: tier.monthly, tierAnnual: tierAnnual, packs: packs, total: tierAnnual + packs };
        }

        function calculate() {
            var n  = parseInt(integrations.value, 10);
            var r  = parseInt(rate.value, 10);
            var bh = parseInt(buildHours.value, 10);
            var mh = parseInt(maintHours.value, 10);
            var apiNeed  = parseInt(apiSlider.value, 10);
            var aiNeed   = parseInt(aiSlider.value, 10);
            var privNeed = parseInt(privateSlider.value, 10);

            // Update display values
            integrationsVal.textContent = n;
            rateVal.textContent = '\u20AC' + r + '/hr';
            buildHoursVal.textContent = bh;
            maintHoursVal.textContent = mh;
            apiVal.textContent = fmtCalls(apiNeed);
            aiVal.textContent = aiNeed.toLocaleString('en-IE');
            privateVal.textContent = privNeed;

            // In-house cost
            var totalInHouse = (n * bh * r) + (n * mh * r * 12);
            inhouseEl.textContent = fmt.format(totalInHouse) + '/yr';

            // Find cheapest tier + packs
            var best = null;
            for (var i = 0; i < tiers.length; i++) {
                var opt = tierCost(tiers[i], apiNeed, aiNeed, privNeed);
                if (!best || opt.total < best.total) best = opt;
            }

            // Build breakdown text
            var monthlyTotal = Math.round(best.total / 12);
            var breakdown = best.name + ' \u00B7 ' + fmt.format(best.tierMonthly) + '/mo';
            if (best.packs > 0) {
                var packsMonthly = Math.round(best.packs / 12);
                breakdown += ' + ' + fmt.format(packsMonthly) + '/mo top\u2011ups';
            }

            ohCostEl.textContent = fmt.format(best.total) + '/yr';
            ohBreakdownEl.textContent = breakdown;

            // Savings
            var annualSavings = totalInHouse - best.total;
            savingsEl.textContent = annualSavings > 0 ? fmt.format(annualSavings) + '/yr' : fmt.format(0) + '/yr';

            // Payback
            if (totalInHouse > 0 && best.total > 0) {
                var paybackMonths = best.total / (totalInHouse / 12);
                if (paybackMonths < 1) paybackEl.textContent = '< 1 month';
                else if (paybackMonths > 12) paybackEl.textContent = '12+ months';
                else paybackEl.textContent = paybackMonths.toFixed(1) + ' months';
            } else {
                paybackEl.textContent = '\u2014';
            }

            // CTA — Enterprise suggestion if usage is very high
            if (privNeed > 10 || apiNeed > 4000000 || aiNeed > 4000) {
                ctaEl.href = '/contact';
                ctaEl.textContent = 'Talk to Sales \u2192';
            } else {
                ctaEl.href = 'https://app.onehazel.com';
                ctaEl.textContent = 'Start Free Trial \u2192';
            }
        }

        var allSliders = [integrations, rate, buildHours, maintHours, apiSlider, aiSlider, privateSlider];
        allSliders.forEach(function (s) { s.addEventListener('input', calculate); });

        calculate();
    }

    initROICalculator();
})();
