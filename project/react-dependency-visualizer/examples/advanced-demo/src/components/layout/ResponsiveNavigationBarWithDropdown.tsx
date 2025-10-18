import React from "react";
import { PrimaryButton, SecondaryButton } from "../../ui/Button";
import Avatar from "../../ui/Avatar";
import { useAuthenticationState } from "../../hooks/useAuthenticationState";

export const ResponsiveNavigationBarWithDropdown: React.FC = () => {
    const { isAuthenticated, user } = useAuthenticationState();

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 30px",
                background: "#1e293b",
                color: "white",
            }}
        >
            <h1 style={{ margin: 0, fontSize: "24px" }}>MyApp</h1>
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                {isAuthenticated && <span>Hello, {user.name}</span>}
                <PrimaryButton />
                <SecondaryButton />
                <Avatar />
            </div>
        </nav>
    );
};
