/**
 * GNIA Currency Converter for Pricing Section
 * Handles dynamic price updates and pricing tab switching.
 */

const exchangeRates = {
    'COP': { rate: 1, symbol: '$', locale: 'es-CO', name: 'Peso Colombiano' },
    'USD': { rate: 0.00025, symbol: '$', locale: 'en-US', name: 'Dolar' },
    'MXN': { rate: 0.0048, symbol: '$', locale: 'es-MX', name: 'Peso Mexicano' },
    'PEN': { rate: 0.00095, symbol: 'S/', locale: 'es-PE', name: 'Sol Peruano' },
    'EUR': { rate: 0.00023, symbol: '€', locale: 'de-DE', name: 'Euro' },
    'CLP': { rate: 0.24, symbol: '$', locale: 'es-CL', name: 'Peso Chileno' },
    'ARS': { rate: 0.25, symbol: '$', locale: 'es-AR', name: 'Peso Argentino' },
    'BOB': { rate: 0.0017, symbol: 'Bs.', locale: 'es-BO', name: 'Peso Boliviano' },
    'CRC': { rate: 0.13, symbol: '₡', locale: 'es-CR', name: 'Colon Costarricense' },
    'BRL': { rate: 0.0012, symbol: 'R$', locale: 'pt-BR', name: 'Real Brazileño' },
    'GTQ': { rate: 0.0019, symbol: 'Q', locale: 'es-GT', name: 'Quetzal Guatemalteco' }
};

let currentCurrency = 'COP';

document.addEventListener('DOMContentLoaded', () => {
    // --- Currency Selector Logic ---
    const customSelector = document.getElementById('custom-currency-selector');
    const selectedDisplay = document.getElementById('selected-currency');
    const dropdown = document.getElementById('currency-dropdown');
    const options = document.querySelectorAll('.currency-option');
    const selectedText = document.querySelector('.selected-text');
    const selectedFlag = document.querySelector('.selected-currency .flag-icon');

    if (customSelector) {
        // Toggle dropdown
        selectedDisplay.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelector.classList.toggle('open');
        });

        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const name = option.querySelector('.currency-name').textContent;
                const flagSrc = option.querySelector('.flag-icon').src;

                // Update Active State in UI
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                // Update Selected Display
                selectedText.textContent = `${name} (${value})`;
                selectedFlag.src = flagSrc;

                // Close dropdown
                customSelector.classList.remove('open');

                // Update Prices
                currentCurrency = value;
                updatePrices(value);
            });
        });

        // Close on click outside
        document.addEventListener('click', () => {
            customSelector.classList.remove('open');
        });

        // Set initial state
        const activeOption = document.querySelector('.currency-option.active');
        if (activeOption) {
            currentCurrency = activeOption.getAttribute('data-value');
            updatePrices(currentCurrency);
        }
    }

    // --- Pricing Category Tabs ---
    const pricingTabButtons = document.querySelectorAll('.pricing-tab-btn');
    const pricingPanes = document.querySelectorAll('.pricing-pane');

    pricingTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-pricing-tab');

            // Update button states
            pricingTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update pane visibility
            pricingPanes.forEach(pane => pane.classList.remove('active'));
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }

            // Re-apply currency conversion for newly visible pane
            updatePrices(currentCurrency);
        });
    });
});

function formatPrice(price, currency, rateData) {
    if (currency === 'USD' || currency === 'EUR' || currency === 'GBP') {
        return price.toLocaleString(rateData.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        if (price < 100) {
            return price.toLocaleString(rateData.locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            return Math.round(price).toLocaleString(rateData.locale, {
                maximumFractionDigits: 0
            });
        }
    }
}

function updatePrices(currency) {
    const rateData = exchangeRates[currency];
    if (!rateData) return;

    // Update yearly prices
    const yearlyElements = document.querySelectorAll('.plan-price-yearly[data-base-price-year]');
    yearlyElements.forEach(el => {
        const basePrice = parseFloat(el.getAttribute('data-base-price-year'));
        if (isNaN(basePrice)) return;

        const convertedPrice = basePrice * rateData.rate;
        const formattedPrice = formatPrice(convertedPrice, currency, rateData);

        // Preserve the discount badge if it exists
        const badge = el.querySelector('.discount-badge');
        const badgeHtml = badge ? badge.outerHTML : '';
        el.innerHTML = `${badgeHtml}${rateData.symbol}${formattedPrice} <small>${currency}/año</small>`;
    });

    // Update monthly prices
    const monthlyElements = document.querySelectorAll('.plan-price-monthly[data-base-price-month]');
    monthlyElements.forEach(el => {
        const basePrice = parseFloat(el.getAttribute('data-base-price-month'));
        if (isNaN(basePrice)) return;

        const convertedPrice = basePrice * rateData.rate;
        const formattedPrice = formatPrice(convertedPrice, currency, rateData);
        el.innerHTML = `${rateData.symbol}${formattedPrice} <small>${currency}/mes</small>`;
    });
}
