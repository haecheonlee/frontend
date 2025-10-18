export const isEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isPhoneNumber = (phone) => {
    return /^\d{10}$/.test(phone);
};
