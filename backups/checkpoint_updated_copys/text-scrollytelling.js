/**
 * AUTOMATIC BRAND BANNER LOOP
 * Cycles through messages every 2.0 seconds automatically.
 */

document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.scrolly-item');

    if (items.length === 0) return;

    let currentIndex = 0;

    // Set initial state
    gsap.set(items, { opacity: 0, y: 20, visibility: 'hidden' });
    gsap.set(items[0], { opacity: 1, y: 0, visibility: 'visible' });
    items[0].classList.add('active');

    function animateToNext() {
        const currentItem = items[currentIndex];
        const nextIndex = (currentIndex + 1) % items.length;
        const nextItem = items[nextIndex];

        const tl = gsap.timeline();

        // Transition OUT current
        tl.to(currentItem, {
            opacity: 0,
            y: -20,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                currentItem.classList.remove('active');
                gsap.set(currentItem, { visibility: 'hidden' });
            }
        });

        // Transition IN next
        tl.fromTo(nextItem,
            { opacity: 0, y: 20, visibility: 'visible' },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onStart: () => {
                    nextItem.classList.add('active');
                }
            },
            "-=0.6" // Smooth overlap
        );

        currentIndex = nextIndex;
    }

    // Automatic loop every 2 seconds
    setInterval(animateToNext, 2000);
});
