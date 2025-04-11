export const formatPrice = (price: number): string => {
  return `₦${price.toLocaleString()}`;
};

// You can also add other utility functions here as needed
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Add any other utility functions you might need in the future 