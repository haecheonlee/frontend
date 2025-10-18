import React from "react";

export const Footer = () => (
    <footer
        style={{
            padding: "20px",
            borderTop: "1px solid #ddd",
            marginTop: "40px",
        }}
    >
        <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
    </footer>
);
