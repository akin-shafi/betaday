// lib/utils.ts

// Format price with comma for thousands and add currency symbol
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

// Format general number with comma
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-NG');
};

// Add any other utility functions you might need in the future
