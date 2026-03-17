document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Logic
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuDrawer = document.querySelector('.mobile-menu-drawer');

    if (mobileMenuToggle && mobileMenuDrawer) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuDrawer.classList.toggle('active');
        });

        // Mobile Dropdown Funciones
        const mobileFunctionsToggle = document.getElementById('mobileFunctionsToggle');
        const mobileFunctionsSubmenu = document.getElementById('mobileFunctionsSubmenu');

        if (mobileFunctionsToggle && mobileFunctionsSubmenu) {
            mobileFunctionsToggle.addEventListener('click', () => {
                mobileFunctionsToggle.classList.toggle('active');
                mobileFunctionsSubmenu.classList.toggle('active');
            });
        }

        // Close drawer on link click
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-submenu-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuDrawer.classList.remove('active');
                if (mobileFunctionsToggle) mobileFunctionsToggle.classList.remove('active');
                if (mobileFunctionsSubmenu) mobileFunctionsSubmenu.classList.remove('active');
            });
        });
    }

    // Tabs Navigation (Desktop & Mobile Dropdown)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const mobileTabsToggle = document.getElementById('mobileTabsToggle');
    const mobileTabsDropdown = document.querySelector('.mobile-tabs-dropdown');
    const mobileTabsItems = document.querySelectorAll('.mobile-tabs-item');

    const setActiveTab = (tabId) => {
        // Desktop
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });

        // Toggle Neon Glass classes on wrapper
        const wrapper = document.querySelector('.tabs-content-wrapper');
        if (wrapper) {
            wrapper.classList.remove('has-neon-pro', 'has-neon-gold', 'has-neon-elite');
            if (tabId === 'tab-chef') wrapper.classList.add('has-neon-pro');
            else if (tabId === 'tab-small') wrapper.classList.add('has-neon-gold');
            else if (tabId === 'tab-large') wrapper.classList.add('has-neon-elite');
            
            // Auto-scroll hacia el contenedor al cambiar la pestaña
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Mobile Dropdown
        mobileTabsItems.forEach(item => {
            const isActive = item.getAttribute('data-tab') === tabId;
            item.classList.toggle('active', isActive);
            if (isActive && mobileTabsToggle) {
                mobileTabsToggle.textContent = item.textContent;
            }
        });

        if (mobileTabsDropdown) {
            mobileTabsDropdown.classList.remove('open');
        }
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveTab(btn.getAttribute('data-tab'));
        });
    });

    if (mobileTabsToggle) {
        mobileTabsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileTabsDropdown.classList.toggle('open');
        });
    }

    mobileTabsItems.forEach(item => {
        item.addEventListener('click', () => {
            setActiveTab(item.getAttribute('data-tab'));
        });
    });

    document.addEventListener('click', (e) => {
        if (mobileTabsDropdown && !mobileTabsDropdown.contains(e.target)) {
            mobileTabsDropdown.classList.remove('open');
        }
    });

    // Sub-sliders for specific Chef tabs
    const initSubSlider = (sliderId) => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            const slides = slider.querySelectorAll('.tab-img');
            let currentSlide = 0;

            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 1800);
        }
    };

    initSubSlider('chefSlider');
    initSubSlider('smallSlider');
    initSubSlider('largeSlider');

    // WhatsApp Prefix Selector Logic
    const pSelector = document.getElementById('whatsapp-prefix-selector');
    const sPrefix = document.getElementById('selected-prefix');

    if (pSelector && sPrefix) {
        const prefixCode = document.querySelector('.prefix-code');
        const prefixFlag = document.querySelector('.prefix-flag');

        sPrefix.addEventListener('click', (e) => {
            e.stopPropagation();
            pSelector.classList.toggle('open');
        });

        const prefixOptions = document.querySelectorAll('.prefix-option');
        prefixOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                const code = opt.getAttribute('data-code');
                const flag = opt.getAttribute('data-flag');

                prefixCode.textContent = code;
                prefixFlag.src = `https://flagcdn.com/w40/${flag}.png`;
                pSelector.classList.remove('open');
            });
        });

        document.addEventListener('click', () => {
            pSelector.classList.remove('open');
        });
    }

    // Image Modal Logic
    const imageModal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');

    if (imageModal && modalImg) {
        const closeModal = () => {
            imageModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        document.querySelectorAll('.btn-expand').forEach(btn => {
            btn.addEventListener('click', () => {
                const imgSrc = btn.getAttribute('data-img');
                modalImg.src = imgSrc;
                imageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const modalClose = document.querySelector('.modal-close');
        if (modalClose) modalClose.addEventListener('click', closeModal);

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Video Modal Logic
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalSupademo = document.getElementById('modalSupademo');

    if (videoModal && modalVideo) {
        const closeVideoModal = () => {
            videoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            modalVideo.pause();
            modalVideo.src = "";
            if (modalSupademo) modalSupademo.src = "";
        };

        const moduleTags = document.querySelectorAll('.module-tag[data-video], .module-tag[data-supademo]');
        moduleTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation();
                const videoUrl = tag.getAttribute('data-video');
                const supaUrl = tag.getAttribute('data-supademo');

                if (supaUrl && modalSupademo) {
                    modalVideo.style.display = 'none';
                    modalSupademo.style.display = 'block';
                    modalSupademo.src = supaUrl;
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else if (videoUrl) {
                    if (modalSupademo) modalSupademo.style.display = 'none';
                    modalVideo.style.display = 'block';
                    modalVideo.src = videoUrl;
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    const playPromise = modalVideo.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Autoplay was prevented:", error);
                        });
                    }
                }
            });
        });

        const videoClose = document.querySelector('.modal-close-video');
        if (videoClose) videoClose.addEventListener('click', closeVideoModal);

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }

    // FAQ Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // FAQ Tabs Logic
    const fBtns = document.querySelectorAll('.faq-tab-btn'), fPanes = document.querySelectorAll('.faq-tab-pane');
    const fToggle = document.getElementById('faqTabsToggle'), fMenu = document.getElementById('faqTabsMenu'), fItems = document.querySelectorAll('.mobile-tabs-item[data-faq-tab]');
    const setFaqTab = id => {
        fBtns.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-faq-tab') === id));
        fPanes.forEach(pane => pane.classList.toggle('active', pane.id === id));
        const aItem = Array.from(fItems).find(i => i.getAttribute('data-faq-tab') === id);
        if (aItem && fToggle) {
            fToggle.querySelector('span').textContent = aItem.textContent;
            fItems.forEach(i => i.classList.remove('active'));
            aItem.classList.add('active');
        }
        if (fMenu) fMenu.classList.remove('active');
    };
    fBtns.forEach(btn => btn.addEventListener('click', () => setFaqTab(btn.getAttribute('data-faq-tab'))));
    if (fToggle) fToggle.addEventListener('click', (e) => { e.stopPropagation(); if (fMenu) fMenu.classList.toggle('active'); });
    fItems.forEach(item => item.addEventListener('click', () => setFaqTab(item.getAttribute('data-faq-tab'))));
    document.addEventListener('click', (e) => { if (fMenu && fMenu.classList.contains('active') && !fToggle.contains(e.target) && !fMenu.contains(e.target)) fMenu.classList.remove('active'); });
});
