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
            // Add a slight darkened effect/scale to the card being covered
            onUpdate: (self) => {
                // Determine how much of the next card is covering this one
                // This is optional for extra polish
            }
        });

        // Animation for the content inside each card
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
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1,
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Refresh ScrollTrigger to ensure correct heights
    ScrollTrigger.refresh();
});
