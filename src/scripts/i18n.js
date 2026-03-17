
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
            // Using innerHTML to allow HTML tags in the JSON (like spans for styling)
            element.innerHTML = value;
        }
    });
}

function getNestedValue(obj, key) {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}
