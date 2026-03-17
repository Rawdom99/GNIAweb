/**
 * SERVICES STACKING CARDS - INTERACTIVE VERSION
 * Uses GSAP ScrollTrigger for a robust "One-covers-the-other" effect.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not found. Animation might not work.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray('.service-stack-panel');

    if (cards.length === 0) return;

    // Create the stacking effect
    cards.forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: "top top",
            pin: true,
            pinSpacing: false, // This allows the next card to overlap
            scrub: true,
            anticipatePin: 1, // Reduces pinning jumps
            onEnter: () => gsap.set(card, { zIndex: 10 + i }), // Ensure stacking order
            onEnterBack: () => gsap.set(card, { zIndex: 10 + i })
        });

        // Animation for the content inside each card
        // FIX: The very first card (i=0) uses the global section as trigger to avoid pinning paradox
        const animTrigger = (i === 0) ? ".services-stack-section" : card;
        const startTrigger = (i === 0) ? "top 60%" : "top bottom";

        gsap.fromTo(card.querySelector('.service-stack-content'),
            {
                opacity: 0,
                y: 100,
                scale: 0.9,
                filter: "blur(10px)"
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out",
                immediateRender: false, // Prevent captured states before layout is ready
                scrollTrigger: {
                    trigger: animTrigger,
                    start: startTrigger,
                    end: "top 20%",
                    scrub: 1,
                    invalidateOnRefresh: true, // Recalculates on mobile browser resize (address bar)
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Animation for the IMAGE (Slide from Left)
        gsap.fromTo(card.querySelector('.service-stack-image-wrapper'),
            {
                opacity: 0,
                x: -100, // Start 100px to the left
                filter: "blur(5px)"
            },
            {
                opacity: 1,
                x: 0, // Slide to original position
                filter: "blur(0px)",
                duration: 1.2,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                    trigger: animTrigger,
                    start: startTrigger, // Synced with text trigger
                    end: "top 20%",
                    scrub: 1, // Smooth scrubbing
                    invalidateOnRefresh: true,
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Refresh ScrollTrigger to ensure correct heights
    // FIX: Add a slightly longer delay for mobile stabilization
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1000);

    // Final Refresh once EVERYTHING (images) is loaded
    window.addEventListener('load', () => {
        // Double refresh for deep stability
        ScrollTrigger.refresh();
        setTimeout(() => ScrollTrigger.refresh(), 500);
    });
});
