import React, { useEffect } from "react";
import { TextInputWithValidation } from "../../../components/forms/TextInputWithValidation";
import { PrimaryButton, SecondaryButton } from "../../../ui/Button";
import { useAuthenticationState } from "../../../hooks/useAuthenticationState";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { usePrevious } from "../../../hooks/usePrevious";

export const LoginFormWithValidationAndErrorHandling: React.FC = () => {
    const { isAuthenticated, user } = useAuthenticationState();
    const [rememberMe, setRememberMe] = useLocalStorage("rememberMe");
    const value = usePrevious(rememberMe);

    useEffect(() => {
        console.log("rememberMe changed from", value, "to", rememberMe);
    }, [rememberMe, value]);

    return (
        <form style={{ padding: "20px", maxWidth: "400px" }}>
            <h2>Login</h2>
            {isAuthenticated && <p>Welcome back, {user.name}!</p>}
            <TextInputWithValidation />
            <TextInputWithValidation />
            <label>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
            </label>
            <PrimaryButton />
            <SecondaryButton />
        </form>
    );
};
