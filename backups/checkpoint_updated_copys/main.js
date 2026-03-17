console.log('GNIA System Online');

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuDrawer = document.querySelector('.mobile-menu-drawer');

    if (menuToggle && menuDrawer) {
        menuToggle.addEventListener('click', () => {
            menuDrawer.classList.toggle('active');
        });

        // Close menu when clicking a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuDrawer.classList.remove('active');
            });
        });
    }

    // --- Tab Navigation Logic ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const mobileTabsToggle = document.getElementById('mobileTabsToggle');
    const mobileTabsMenu = document.getElementById('mobileTabsMenu');
    const mobileTabsItems = document.querySelectorAll('.mobile-tabs-item');
    const mobileDropdown = document.querySelector('.mobile-tabs-dropdown');

    function setActiveTab(tabId) {
        // Update Buttons
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        // Update Panes
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });

        // Update Mobile Dropdown
        mobileTabsItems.forEach(item => {
            const isActive = item.getAttribute('data-tab') === tabId;
            item.classList.toggle('active', isActive);
            if (isActive && mobileTabsToggle) {
                mobileTabsToggle.textContent = item.textContent;
            }
        });

        // Close dropdown
        if (mobileDropdown) mobileDropdown.classList.remove('open');
    }

    // Desktop Buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            setActiveTab(button.getAttribute('data-tab'));
        });
    });

    // Mobile Dropdown Toggle
    if (mobileTabsToggle) {
        mobileTabsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileDropdown.classList.toggle('open');
        });
    }

    // Mobile Items
    mobileTabsItems.forEach(item => {
        item.addEventListener('click', () => {
            setActiveTab(item.getAttribute('data-tab'));
        });
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        if (mobileDropdown && !mobileDropdown.contains(e.target)) {
            mobileDropdown.classList.remove('open');
        }
    });
    // --- Tab Sliders Logic ---
    function initSlider(sliderId) {
        const slider = document.getElementById(sliderId);
        if (slider) {
            const slides = slider.querySelectorAll('.tab-img');
            let currentSlide = 0;

            function nextSlide() {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }

            setInterval(nextSlide, 1800); // Change image every 1.8 seconds
        }
    }

    initSlider('chefSlider');
    initSlider('smallSlider');
    initSlider('largeSlider');
});
