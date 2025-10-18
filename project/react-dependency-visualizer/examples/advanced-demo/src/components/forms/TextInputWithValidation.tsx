import React from "react";

export const TextInputWithValidation = React.forwardRef<HTMLInputElement>(
    (props, ref) => (
        <div style={{ marginBottom: "15px" }}>
            <input
                ref={ref}
                type="text"
                placeholder="Enter text..."
                style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                }}
            />
        </div>
    )
);
