
document.addEventListener('DOMContentLoaded', () => {
    const defaultLocale = 'es';
    const localeByUser = navigator.language.split('-')[0];
    // For now, force 'es' or fallback to it as we only have es.json
    const currentLocale = 'es';

    loadLocale(currentLocale);
});

async function loadLocale(locale) {
    try {
        const response = await fetch(`src/locales/${locale}.json`);
        if (!response.ok) {
            throw new Error(`Could not load locale ${locale}`);
        }
        const translations = await response.json();
        applyTranslations(translations);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function applyTranslations(translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(translations, key);
        if (value) {
            // Sanitize HTML from translations to prevent XSS
            element.innerHTML = sanitizeHTML(value);
        }
    });
}

/**
 * Sanitize HTML string: allow only safe formatting tags, strip scripts & event handlers.
 */
function sanitizeHTML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    // Remove all script elements
    doc.querySelectorAll('script').forEach(el => el.remove());
    // Remove event handler attributes from all elements
    doc.body.querySelectorAll('*').forEach(el => {
        for (const attr of [...el.attributes]) {
            if (attr.name.startsWith('on') || attr.value.includes('javascript:')) {
                el.removeAttribute(attr.name);
            }
        }
    });
    return doc.body.innerHTML;
}

function getNestedValue(obj, key) {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}
