import React from "react";

export const Modal = React.forwardRef<HTMLDivElement>((props, ref) => (
    <div
        ref={ref}
        style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
    >
        <h2>Modal Title</h2>
        <p>Modal content</p>
    </div>
));
