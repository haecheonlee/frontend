import { useEffect } from "react";

export const useOnMount = (callback: () => void | (() => void)): void => {
    useEffect(() => {
        return callback();
    }, []);
};

