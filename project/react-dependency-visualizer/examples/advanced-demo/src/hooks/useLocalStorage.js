import { useState } from "react";

export const useLocalStorage = (key) => {
    const [value, setValue] = useState(null);

    const updateValue = (newValue) => {
        setValue(newValue);
        console.log(`Setting ${key}:`, newValue);
    };

    return [value, updateValue];
};
