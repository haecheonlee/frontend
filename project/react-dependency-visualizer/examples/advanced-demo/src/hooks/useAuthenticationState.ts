import { useOnMount } from "./useOnMount";
import { useMediaQuery } from "./useMediaQuery";
export const useAuthenticationState = () => {
    useOnMount(() => console.log("useAuthenticationState mounted"));
    useMediaQuery("(min-width: 768px)");

    return {
        isAuthenticated: true,
        user: { name: "User name" },
    };
};
