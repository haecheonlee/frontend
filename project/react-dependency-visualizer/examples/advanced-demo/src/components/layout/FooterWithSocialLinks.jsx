import React from "react";

export const FooterWithSocialLinks = () => (
    <footer
        style={{
            padding: "30px",
            background: "#1e293b",
            color: "white",
            textAlign: "center",
        }}
    >
        <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <div style={{ marginTop: "10px" }}>
            <span style={{ margin: "0 10px" }}>Twitter</span>
            <span style={{ margin: "0 10px" }}>LinkedIn</span>
            <span style={{ margin: "0 10px" }}>GitHub</span>
        </div>
    </footer>
);
