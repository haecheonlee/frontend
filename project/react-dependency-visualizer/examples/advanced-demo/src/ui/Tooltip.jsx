import React from "react";

export const Tooltip = ({ children }) => (
    <div
        style={{
            position: "relative",
            display: "inline-block",
        }}
    >
        {children}
        <span
            style={{
                visibility: "hidden",
                background: "#1e293b",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                position: "absolute",
                bottom: "125%",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "12px",
            }}
        >
            Tooltip text
        </span>
    </div>
);
