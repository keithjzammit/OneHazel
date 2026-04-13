/**
 * OneHazel — shared site JS
 * Theme toggle + sector-themed background decorations
 */
(function () {
    var html = document.documentElement;

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
        // Create decoration container
        var deco = document.createElement('div');
        deco.className = 'section-icons';
        deco.setAttribute('aria-hidden', 'true');

        for (var i = 0; i < 8; i++) {
            var el = document.createElement('i');
            // Use 'fas' for solid, 'fab' for brand icons like fa-pagelines
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

        // Insert as first child so it's behind content
        section.insertBefore(deco, section.firstChild);
    });
})();
