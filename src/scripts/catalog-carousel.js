document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.catalog-img');
    if (slides.length === 0) return;

    // Expose functions for master script synchronization
    window.heroCarousel = {
        showSlide: function (index) {
            const slide = slides[index];
            if (!slide) return;

            // Clean up states
            slides.forEach(s => s.classList.remove('exit'));

            slide.classList.add('active');
        },
        hideSlide: function (index) {
            const slide = slides[index];
            if (!slide) return;

            slide.classList.remove('active');
            slide.classList.add('exit');

            setTimeout(() => {
                slide.classList.remove('exit');
            }, 600);
        }
    };
});
