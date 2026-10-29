export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Compact currency formatter for summary cards.
 * Uses Indian numbering abbreviations: K, L (Lakh), Cr (Crore).
 * Falls back to full format for small numbers.
 */
export const formatCurrencyCompact = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_00_00_000) {
    // Crores (≥ 1,00,00,000)
    const val = (abs / 1_00_00_000).toFixed(2).replace(/\.?0+$/, '');
    return `${sign}₹${val}Cr`;
  }
  if (abs >= 1_00_000) {
    // Lakhs (≥ 1,00,000)
    const val = (abs / 1_00_000).toFixed(2).replace(/\.?0+$/, '');
    return `${sign}₹${val}L`;
  }
  if (abs >= 1_000) {
    // Thousands (≥ 1,000)
    const val = (abs / 1_000).toFixed(1).replace(/\.?0+$/, '');
    return `${sign}₹${val}K`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatMonthYear = (month, year) => {
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
};
