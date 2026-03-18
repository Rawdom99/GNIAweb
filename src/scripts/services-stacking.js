/**
 * SERVICES SLIDER - PROGRESS INDICATOR LOGIC
 */
(function () {
    'use strict';

    function initSlider() {
        var track = document.getElementById('servicesSliderTrack');
        var indicator = document.getElementById('sliderIndicator');
        var cards = document.querySelectorAll('.service-slide-card');

        if (!track || !indicator || cards.length === 0) return;

        function updateProgress() {
            // Calculate how much can be scrolled
            var maxScrollLeft = track.scrollWidth - track.clientWidth;
            
            // If nothing to scroll, keep indicator full
            if (maxScrollLeft <= 0) {
                indicator.style.width = '100%';
                indicator.style.transform = 'translateX(0)';
                return;
            }

            // Calculate progress percentage (0 to 1)
            var scrollPercentage = track.scrollLeft / maxScrollLeft;

            // Width of the indicator is proportional to visible area vs total area
            var visibleRatio = track.clientWidth / track.scrollWidth;
            var indicatorWidthPercent = visibleRatio * 100;
            
            // Apply minimum width for visibility
            indicatorWidthPercent = Math.max(15, indicatorWidthPercent); // min 15% width
            
            indicator.style.width = indicatorWidthPercent + '%';

            // Calculate translation of the indicator
            // It moves from 0 to (100 - indicatorWidthPercent)% of the parent container
            var maxTranslate = 100 - indicatorWidthPercent;
            var currentTranslate = maxTranslate * scrollPercentage;

            // Using simple relative percentage calculation
            // The formula is: currentTranslate = (scrollPosition / (totalWidth - visibleWidth)) * (100 - indicatorWidth)
            indicator.style.left = currentTranslate + '%';
        }

        // Listen to scroll events on the track
        track.addEventListener('scroll', function() {
            window.requestAnimationFrame(updateProgress);
        });

        // Initial setup and handle window resize
        updateProgress();
        
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                window.requestAnimationFrame(updateProgress);
            }, 100);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        initSlider();
    }
})();
