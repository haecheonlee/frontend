import React from "react";

export const PrimaryButton = React.forwardRef<HTMLButtonElement>(
    (props, ref) => (
        <button
            ref={ref}
            style={{
                padding: "8px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            }}
        >
            Primary
        </button>
    )
);

export const SecondaryButton = React.forwardRef<HTMLButtonElement>(
    (props, ref) => (
        <button
            ref={ref}
            style={{
                padding: "8px 16px",
                background: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            }}
        >
            Secondary
        </button>
    )
);

export default PrimaryButton;
