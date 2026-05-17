import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { getAvailableCurrencies } from '../../utils/currencyConverter';

/**
 * CurrencySelector Component - Dropdown to select currency
 * Displays as a styled dropdown in top-right area
 */
export default function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const currencies = getAvailableCurrencies();

  return (
    <div className="relative inline-block">
      <select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        className="appearance-none px-4 py-2 pr-8 pt-3 pb-3 border-2 border-custom-charcoal rounded-lg font-semibold text-custom-charcoal bg-custom-white hover:border-custom-black transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-custom-charcoal focus:ring-offset-2"
      >
       {currencies.map((currency) => (
           <option key={currency.code} value={currency.code}>
             {currency.code}
           </option>
         ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-custom-charcoal">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
