document.addEventListener('DOMContentLoaded', () => {
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".typing-cursor");

    const textArray = ["INSUMOS", "RECETAS", "VENTAS", "INVENTARIOS", "GASTOS", "PROVEEDORES", "CATALOGOS", "FACTURACIÓN", "COTIZACIÓN", "ROLES"];
    const typingDelay = 40;
    const erasingDelay = 20;
    const stayDelay = 1200; // Time text stays full on screen (1.2s)
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        // Trigger carousel ENTRANCE at the start of typing
        if (charIndex === 0 && window.heroCarousel) {
            window.heroCarousel.showSlide(textArrayIndex);
        }

        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, stayDelay);
        }
    }

    function erase() {
        // Trigger carousel EXIT at the start of erasing
        if (charIndex === textArray[textArrayIndex].length && window.heroCarousel) {
            window.heroCarousel.hideSlide(textArrayIndex);
        }

        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            // Short pause before next word-image pair (Total cycle ~2s)
            setTimeout(type, 300);
        }
    }

    if (textArray.length) setTimeout(type, 500);
});
