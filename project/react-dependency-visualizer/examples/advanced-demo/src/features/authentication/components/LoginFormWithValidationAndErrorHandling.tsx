import React from "react";
import { TextInputWithValidation } from "../../../components/forms/TextInputWithValidation";
import { PrimaryButton, SecondaryButton } from "../../../ui/Button";
import { useAuthenticationState } from "../../../hooks/useAuthenticationState";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

export const LoginFormWithValidationAndErrorHandling: React.FC = () => {
    const { isAuthenticated, user } = useAuthenticationState();
    const [rememberMe, setRememberMe] = useLocalStorage("rememberMe");

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
