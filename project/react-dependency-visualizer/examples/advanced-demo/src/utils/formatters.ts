export const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
};

export const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
};
