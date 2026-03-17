// GNIA Features Minified
document.addEventListener('DOMContentLoaded', () => {
    const fTabs = document.querySelectorAll('.feature-tab'), dPanels = document.querySelectorAll('.feature-display-panel');
    fTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            fTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            dPanels.forEach(panel => {
                panel.classList.remove('active', 'switching');
                if (panel.id === targetId) {
                    panel.classList.add('active'); void panel.offsetWidth; panel.classList.add('switching');
                    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });
    });

    const sTrigger = document.getElementById('selectorTrigger'), mSelector = document.querySelector('.mobile-feature-selector');
    const cSelName = document.getElementById('currentSelectionName');
    if (sTrigger) sTrigger.addEventListener('click', () => mSelector.classList.toggle('open'));
    document.querySelectorAll('.selector-option').forEach(opt => {
        opt.addEventListener('click', () => {
            if (cSelName) cSelName.innerHTML = opt.innerHTML;
            if (mSelector) mSelector.classList.remove('open');
            const dTab = document.querySelector(`.feature-tab[data-target="${opt.getAttribute('data-target')}"]`);
            if (dTab) dTab.click();
        });
    });
    document.addEventListener('click', (e) => { if (mSelector && !mSelector.contains(e.target)) mSelector.classList.remove('open'); });

    document.querySelectorAll('.accordion-item').forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });

    let cExpId = null; const clearExp = () => { cExpId = null; };
    const imgModal = document.getElementById('imageModal'), modalImg = document.getElementById('modalImg'), mClose = document.querySelector('.modal-close');
    if (mClose) mClose.addEventListener('click', clearExp);
    if (imgModal) imgModal.addEventListener('click', (e) => { if (e.target === imgModal) clearExp(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') clearExp(); });

    document.querySelectorAll('.feature-img.btn-expand').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); clearExp();
            if (modalImg && imgModal) { modalImg.src = btn.getAttribute('data-img') || btn.src; imgModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
        });
    });

    document.querySelectorAll('.btn-expand-slider').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target'); cExpId = targetId;
            const slider = document.getElementById(targetId);
            if (slider) {
                const actImg = slider.querySelector(slider.classList.contains('hero-slider') ? '.hero-img.active' : '.feature-img.active');
                if (actImg && modalImg && imgModal) { modalImg.src = actImg.getAttribute('data-img') || actImg.src; imgModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
            }
        });
    });

    document.querySelectorAll('.feature-slider, .hero-slider').forEach(slider => {
        if (!slider.id) return;
        const isHero = slider.classList.contains('hero-slider'), imgs = slider.querySelectorAll(isHero ? '.hero-img' : '.feature-img');
        if (imgs.length <= 1) return;
        const interval = parseInt(slider.getAttribute('data-interval')) || 2500;
        let c = 0;
        setInterval(() => {
            imgs[c].classList.remove('active'); c = (c + 1) % imgs.length; imgs[c].classList.add('active');
            if (cExpId === slider.id && imgModal.classList.contains('active') && modalImg) modalImg.src = imgs[c].getAttribute('data-img') || imgs[c].src;
        }, interval);
    });
});
