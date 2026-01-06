/**
 * Formats a number as a currency string for LKR.
 * Example: 2000 -> "2,000.00"
 */
export const formatPrice = (price: number): string => {
    if (price === undefined || price === null || isNaN(price)) {
        return '0.00';
    }
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
};

/**
 * Formats a number with "LKR" prefix.
 */
export const formatLKR = (price: number): string => {
    return `LKR ${formatPrice(price)}`;
};

/**
 * Formats a number with "Rs." prefix.
 */
export const formatRs = (price: number): string => {
    return `Rs. ${formatPrice(price)}`;
};
