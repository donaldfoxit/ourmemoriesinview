/* ==========================================================================
   Voku.Studio™ Replica – Arc Slider Engine
   ========================================================================== */
(function () {
    'use strict';

    /* ── Project Data (from original Voku.Studio CDN) ── */
    const projects = [
        { slug: 'exnihilo-bluetalisman', title: 'Ex Nihilo.Blue Talisman.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/11165841/img_BLUETALISMAN_3-copia-1-916x515.jpg.webp', w: 916, h: 515 },
        { slug: 'theweeknd', title: 'The Weeknd.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/19102756/YZA-Voku-x-The-Weeknd_portada-916x1145.jpg.webp', w: 916, h: 1145 },
        { slug: 'animl', title: 'ANIML.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/03/07104224/Portada-ANIML_YZAVoku-916x516.png.webp', w: 916, h: 516 },
        { slug: 'exnihilo', title: 'Ex Nihilo.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/09101642/exnihilo-copia-916x515.jpg.webp', w: 916, h: 515 },
        { slug: 'luna', title: 'Luna.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/11105009/luna_1.1.1-916x515.png.webp', w: 916, h: 515 },
        { slug: 'helena-rubinstein', title: 'Helena Rubinstein.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/22170804/home.HelenaRubinstein.voku_.studio-916x1145.jpg.webp', w: 916, h: 1145 },
        { slug: 'noenemies', title: 'No Enemies.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/12120024/voku.studio.home_.noenemies-1-916x1145.jpg.webp', w: 916, h: 1145 },
        { slug: 'si-shm', title: 'SI SHM.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/11074558/SI_SHM_Voku-916x515.jpg.webp', w: 916, h: 515 },
        { slug: 'jpgmma', title: 'JPG MMA.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/10162711/jpgmma-916x515.jpg.webp', w: 916, h: 515 },
        { slug: 'miami', title: 'Miami.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/09123618/voku.studio.home_.miami_-916x515.jpg.webp', w: 916, h: 515 },
        { slug: 'laliga', title: 'LaLiga.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/09/11092046/CARTEL-LA-LIGA-916x515.jpg.webp', w: 916, h: 515 },
        { slug: 'al-voku', title: 'AL Voku.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/09112000/AL_VOKU2-copia-916x515.jpg.webp', w: 916, h: 515 },
        { slug: 'voku-home', title: 'Voku.Home.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/09101703/voku.studio.home1-copia-916x644.png.webp', w: 916, h: 644 },
        { slug: 'voku-home2', title: 'Voku.Studio.', img: 'https://d2d7fq3u9j08ti.cloudfront.net/wp-content/uploads/2025/11/09112159/voku.studio.home2_-916x515.jpg.webp', w: 916, h: 515 },
    ];

    const TOTAL = projects.length;

    /* ── DOM refs ── */
    const container = document.getElementById('arcContainer');
    const preloader = document.getElementById('Preloader');
    const thumb = preloader?.querySelector('.thumb');
    const slider = document.getElementById('arc-slider');
    const cookie = document.getElementById('CookieConsent');
    const titleEl = document.getElementById('projectTitle');
    const titleMobileEl = document.getElementById('projectTitleMobile');

    /* ── Sizing functions ── */
    function getCardWidth() {
        const vw = window.innerWidth;
        if (vw <= 480) return vw * 0.35;
        if (vw <= 768) return vw * 0.25;
        return Math.min(vw * 0.18, 300);
    }

    function getArcConfig() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cardW = getCardWidth();

        // Arc curvature – how steeply cards drop from center to edges
        const arcRadius = vh * 0.25;
        // Edge card bottoms sit just above the nav text (nav is at 50% vh)
        const baseY = vh * 0.46;

        return {
            centerX: vw * 0.84 / 2, // center of the 84%-wide container
            baseY,
            arcRadius,
            cardWidth: cardW,
            totalVisible: 14,
        };
    }

    /* ── Build cards ── */
    const cards = [];
    let loadedCount = 0;

    function onImageLoad() {
        loadedCount++;
        const pct = Math.min(loadedCount / TOTAL, 1);
        if (thumb) thumb.style.transform = `scaleX(${pct})`;
        if (pct >= 1) finishPreload();
    }

    function finishPreload() {
        document.body.classList.add('--loaded');
        setTimeout(() => {
            if (preloader) preloader.classList.add('--hidden');
        }, 300);
        setTimeout(() => {
            if (cookie) cookie.classList.add('--visible');
        }, 1500);
    }

    function buildCards() {
        container.innerHTML = '';
        cards.length = 0;

        for (let i = 0; i < TOTAL; i++) {
            const proj = projects[i];
            const el = document.createElement('div');
            el.className = 'arc-card';

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.alt = proj.title;
            img.className = 'arc-card__image';
            img.onload = onImageLoad;
            img.onerror = onImageLoad;
            img.src = proj.img;

            el.appendChild(img);
            container.appendChild(el);

            // Add hover event for bolding title
            el.addEventListener('mouseenter', () => {
                setProjectTitle(proj.title, true);
            });
            el.addEventListener('mouseleave', () => {
                // Revert to the center card's title
                const centerIdx = getCenterIndex();
                setProjectTitle(projects[centerIdx].title, true);
            });

            cards.push({
                el,
                index: i,
                project: proj,
                aspect: 5 / 4, // uniform portrait
            });
        }
    }

    /* ── Project title helper ── */
    function setProjectTitle(title, bold) {
        if (titleEl) {
            titleEl.querySelector('span').textContent = title;
            titleEl.classList.toggle('--active', bold);
        }
        if (titleMobileEl) {
            titleMobileEl.querySelector('span').textContent = title;
            titleMobileEl.classList.toggle('--active', bold);
        }
    }

    /* ── Get current center card index ── */
    function getCenterIndex() {
        const wrapped = ((scrollPos % TOTAL) + TOTAL) % TOTAL;
        return Math.round(wrapped) % TOTAL;
    }

    /* ── Scroll state ── */
    let scrollPos = 0;          // fractional index of the "center" card
    let targetScroll = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let velocity = 0;
    let prevHoveredEl = null;

    /* ── Layout cards on the arc ── */
    function layoutCards() {
        const cfg = getArcConfig();
        const halfVisible = cfg.totalVisible / 2;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // The bottom line where center card bottom sits (nav is now at 56% vh)
        const bottomLine = vh * 0.50;

        // Center card height (tallest) — reduced height
        const maxCardH = vh * 0.34;
        // Minimum card height
        const minCardH = vh * 0.12;
        const containerW = vw * 0.84;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            // How far is this card from the center scroll position?
            let diff = i - scrollPos;
            // Wrap for looping
            while (diff > TOTAL / 2) diff -= TOTAL;
            while (diff < -TOTAL / 2) diff += TOTAL;

            const absDiff = Math.abs(diff);

            // Skip cards way too far away
            if (absDiff > halfVisible + 1) {
                card.el.style.opacity = '0';
                card.el.style.pointerEvents = 'none';
                continue;
            }

            // ── Card width is constant
            const cardW = cfg.cardWidth;

            // ── Cascading height: center tallest, each step shorter
            // Power curve for more dramatic progressive shortening
            const heightT = Math.min(absDiff / (halfVisible * 0.7), 1);
            const cardH = maxCardH - (maxCardH - minCardH) * Math.pow(heightT, 1.5);

            // ── X position: spread with overlap
            const spreadX = cardW * 0.85;
            const x = cfg.centerX + diff * spreadX;

            // ── Y position: card bottoms drop along a steep arc
            // Stronger parabolic drop for a proper arc shape
            const normalizedDist = diff / halfVisible;
            const arcDrop = cfg.arcRadius * normalizedDist * normalizedDist;
            const y = bottomLine + arcDrop; // y = bottom edge of card

            // ── Z-index: center cards on top
            const zIndex = Math.round(100 - absDiff * 10);

            // ── Opacity: magical instant disappearance at container boundaries
            const leftEdge = x - cardW / 2;
            const rightEdge = x + cardW / 2;
            let opacity = 1;
            // If the card touches or crosses the left (0) or right (containerW) edge, hide it instantly
            if (leftEdge < 0 || rightEdge > containerW) {
                opacity = 0;
            }

            // ── Mark center card
            const isCenter = absDiff < 0.5;
            card.el.classList.toggle('--center', isCenter);

            // ── Scale: center card slightly larger
            const scale = isCenter ? 1.05 : 1;

            card.el.style.cssText = `
                position: absolute;
                left: 0; top: 0;
                width: ${cardW}px;
                height: ${cardH}px;
                transform: translate(${x - cardW / 2}px, ${y - cardH}px) scale(${scale});
                z-index: ${zIndex};
                opacity: ${opacity};
                pointer-events: ${absDiff < 3 ? 'auto' : 'none'};
            `;
        }

        // Update project title to the center card
        const centerIdx = getCenterIndex();
        setProjectTitle(projects[centerIdx].title, true);
    }

    /* ── Animation loop ── */
    function animate() {
        scrollPos += (targetScroll - scrollPos) * 0.08;
        layoutCards();
        requestAnimationFrame(animate);
    }

    /* ── Event handlers ── */
    function onWheel(e) {
        e.preventDefault();
        const d = e.deltaY || e.deltaX;
        targetScroll += d * 0.003;
    }

    function onPointerDown(e) {
        isDragging = true;
        dragStartX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        dragStartScroll = targetScroll;
        velocity = 0;
    }
    function onPointerMove(e) {
        if (!isDragging) return;
        const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        const dx = cx - dragStartX;
        const cfg = getArcConfig();
        targetScroll = dragStartScroll - dx / (cfg.cardWidth * 0.92);
    }
    function onPointerUp() { isDragging = false; }

    function onKeyDown(e) {
        if (e.key === 'ArrowRight') targetScroll += 1;
        if (e.key === 'ArrowLeft') targetScroll -= 1;
    }

    /* ── Cookie dismiss ── */
    document.getElementById('cookieAccept')?.addEventListener('click', () => cookie?.classList.add('--dismissed'));
    document.getElementById('cookieCancel')?.addEventListener('click', () => cookie?.classList.add('--dismissed'));

    /* ── Bind events ── */
    slider.addEventListener('wheel', onWheel, { passive: false });
    slider.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    slider.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', () => layoutCards());

    /* ── Init ── */
    buildCards();
    layoutCards();
    animate();

    // Fallback: if images don't all load within 6s, show anyway
    setTimeout(() => {
        if (!document.body.classList.contains('--loaded')) finishPreload();
    }, 6000);
})();
