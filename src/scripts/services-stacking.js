/**
 * SERVICES STACKING CARDS - DEFINITIVE FIX v2
 * Based on analysis of Menupp's working implementation.
 * Key fixes:
 * 1. history.scrollRestoration = 'manual' (prevents browser scroll conflicts)
 * 2. end: 'max' for persistent pinning (cards stay pinned until max scroll)
 * 3. Stacking DISABLED on mobile (<=768px) to avoid layout breakage
 */

(function () {
    'use strict';

    var MAX_WAIT_MS = 5000;
    var POLL_INTERVAL_MS = 100;
    var MOBILE_BREAKPOINT = 768;
    var SECTION_SELECTOR = '.services-stack-section';
    var PANEL_SELECTOR = '.service-stack-panel';

    // CRITICAL: Prevent browser scroll restoration from fighting GSAP pinning
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    /**
     * Polls for GSAP + ScrollTrigger availability.
     */
    function waitForGSAP() {
        return new Promise(function (resolve, reject) {
            var elapsed = 0;
            function check() {
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                    resolve();
                    return;
                }
                elapsed += POLL_INTERVAL_MS;
                if (elapsed >= MAX_WAIT_MS) {
                    reject(new Error('GSAP/ScrollTrigger timeout'));
                    return;
                }
                setTimeout(check, POLL_INTERVAL_MS);
            }
            check();
        });
    }

    /**
     * Activates fallback mode: shows all cards statically.
     */
    function activateFallback() {
        var section = document.querySelector(SECTION_SELECTOR);
        if (section) section.classList.add('stack-fallback');
        console.warn('[Stacking Cards] Fallback mode activated.');
    }

    /**
     * Check if we're on mobile
     */
    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    /**
     * Main initialization - desktop only.
     */
    function initStackingCards() {
        gsap.registerPlugin(ScrollTrigger);

        var section = document.querySelector(SECTION_SELECTOR);
        var cards = gsap.utils.toArray(PANEL_SELECTOR);

        if (!section || cards.length === 0) return;

        // On mobile: do NOT pin, just show cards in natural flow
        if (isMobile()) {
            section.classList.add('stack-no-pin');
            console.log('[Stacking Cards] Mobile detected, stacking disabled.');
            return;
        }

        // Desktop: activate GSAP pinning
        section.classList.add('stack-gsap-active');

        cards.forEach(function (card, i) {
            // Set z-index so each subsequent card covers the previous
            gsap.set(card, { zIndex: 10 + i });

            // Pin each card at the top
            ScrollTrigger.create({
                trigger: card,
                start: 'top top',
                end: 'max', // Stay pinned until the very end of the page
                pin: true,
                pinSpacing: false,
                anticipatePin: 1,
                invalidateOnRefresh: true
            });

            // Content reveal animation
            var content = card.querySelector('.service-stack-content');
            if (content) {
                gsap.fromTo(content,
                    { opacity: 0, y: 80, scale: 0.95, filter: 'blur(8px)' },
                    {
                        opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power2.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                            end: 'top 20%',
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    }
                );
            }

            // Image slide-in animation
            var imageWrapper = card.querySelector('.service-stack-image-wrapper');
            if (imageWrapper) {
                gsap.fromTo(imageWrapper,
                    { opacity: 0, x: -80, filter: 'blur(5px)' },
                    {
                        opacity: 1, x: 0, filter: 'blur(0px)',
                        duration: 1.2,
                        ease: 'power3.out',
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 80%',
                            end: 'top 20%',
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    }
                );
            }
        });

        // Refresh after setup
        ScrollTrigger.refresh();

        // Refresh after all images load
        window.addEventListener('load', function () {
            ScrollTrigger.refresh();
            setTimeout(function () { ScrollTrigger.refresh(); }, 300);
        });

        // Handle resize / orientation changes
        var resizeTimer;
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                // If user resized to mobile, kill all ScrollTriggers and reload
                if (isMobile()) {
                    ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
                    section.classList.remove('stack-gsap-active');
                    section.classList.add('stack-no-pin');
                    // Remove GSAP inline styles from cards
                    cards.forEach(function (card) {
                        card.style.cssText = '';
                        var content = card.querySelector('.service-stack-content');
                        if (content) content.style.cssText = '';
                        var img = card.querySelector('.service-stack-image-wrapper');
                        if (img) img.style.cssText = '';
                    });
                } else {
                    ScrollTrigger.refresh();
                }
            }, 300);
        }

        window.addEventListener('resize', handleResize);

        // visualViewport API for mobile address bar changes
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    ScrollTrigger.refresh();
                }, 250);
            });
        }

        console.log('[Stacking Cards] Initialized with', cards.length, 'cards (desktop mode).');
    }

    // Boot
    function boot() {
        waitForGSAP()
            .then(initStackingCards)
            .catch(activateFallback);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
