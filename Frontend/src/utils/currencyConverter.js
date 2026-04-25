/**
 * Currency Conversion Utilities
 * Base currency: GBP (£)
 */

// Conversion rates from GBP to other currencies
const CURRENCY_RATES = {
  GBP: 1, // Base currency
  INR: 110, // Indian Rupee
  USD: 1.27, // US Dollar
  EUR: 0.92, // Euro
  JPY: 190, // Japanese Yen
  AUD: 1.97, // Australian Dollar
  CAD: 1.71, // Canadian Dollar
  SGD: 1.71, // Singapore Dollar
  HKD: 9.92, // Hong Kong Dollar
  MYR: 5.96, // Malaysian Ringgit
  THB: 44.55, // Thai Baht
  PHP: 71.50, // Philippine Peso
  IDR: 20300, // Indonesian Rupiah
  PKR: 353, // Pakistani Rupee
  BDT: 133, // Bangladeshi Taka
  CHF: 1.13, // Swiss Franc
};

const CURRENCY_SYMBOLS = {
  GBP: '£',
  INR: '₹',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  AUD: '$',
  CAD: '$',
  SGD: '$',
  HKD: '$',
  MYR: 'RM',
  THB: '฿',
  PHP: '₱',
  IDR: 'Rp',
  PKR: '₨',
  BDT: '৳',
  CHF: 'CHF',
};

const CURRENCY_NAMES = {
  GBP: 'British Pound',
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  MYR: 'Malaysian Ringgit',
  THB: 'Thai Baht',
  PHP: 'Philippine Peso',
  IDR: 'Indonesian Rupiah',
  PKR: 'Pakistani Rupee',
  BDT: 'Bangladeshi Taka',
  CHF: 'Swiss Franc',
};

/**
 * Converts GBP price to selected currency
 * @param {string} priceStr - Price string in GBP format (e.g., "£13.00")
 * @param {string} targetCurrency - Target currency code (default: INR)
 * @returns {string} - Formatted price with currency symbol
 */
export function convertPrice(priceStr, targetCurrency = 'INR') {
  if (!priceStr || !targetCurrency) return '₹0';

  // Extract numeric value from price string
  const numericValue = parseFloat(priceStr.replace(/[£€$,₹฿₱৳₨]/g, ''));

  if (isNaN(numericValue)) return getSymbol(targetCurrency) + '0';

  // Get conversion rate
  const rate = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.INR;

  // Convert to target currency
  let convertedPrice = numericValue * rate;

  // Format based on currency type
  let formattedPrice;
  if (targetCurrency === 'JPY' || targetCurrency === 'IDR' || targetCurrency === 'PKR' || targetCurrency === 'BDT') {
    // These currencies typically don't use decimals
    convertedPrice = Math.round(convertedPrice);
    formattedPrice = convertedPrice.toLocaleString('en-IN');
  } else if (targetCurrency === 'INR' || targetCurrency === 'USD' || targetCurrency === 'EUR') {
    // These use standard decimal formatting
    convertedPrice = Math.round(convertedPrice);
    formattedPrice = convertedPrice.toLocaleString('en-IN');
  } else {
    // Keep decimals for other currencies
    convertedPrice = convertedPrice.toFixed(2);
    formattedPrice = parseFloat(convertedPrice).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const symbol = getSymbol(targetCurrency);
  return `${symbol}${formattedPrice}`;
}

/**
 * Get currency symbol
 * @param {string} currencyCode - Currency code (e.g., 'INR')
 * @returns {string} - Currency symbol
 */
export function getSymbol(currencyCode) {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}

/**
 * Get currency name
 * @param {string} currencyCode - Currency code (e.g., 'INR')
 * @returns {string} - Currency full name
 */
export function getCurrencyName(currencyCode) {
  return CURRENCY_NAMES[currencyCode] || currencyCode;
}

/**
 * Get all available currencies
 * @returns {Array} - Array of currency objects with code, name, and symbol
 */
export function getAvailableCurrencies() {
  return Object.keys(CURRENCY_RATES).map((code) => ({
    code,
    name: CURRENCY_NAMES[code],
    symbol: CURRENCY_SYMBOLS[code],
  }));
}

// Legacy function for backward compatibility
export function convertEURtoINR(priceStr) {
  return convertPrice(priceStr, 'INR');
}

export function convertEURtoINRWithDecimals(priceStr) {
  if (!priceStr) return '₹0.00';

  const numericValue = parseFloat(priceStr.replace(/[£€$,]/g, ''));

  if (isNaN(numericValue)) return '₹0.00';

  const inrPrice = (numericValue * CURRENCY_RATES.INR).toFixed(2);

  return `₹${inrPrice.toLocaleString('en-IN')}`;
}

