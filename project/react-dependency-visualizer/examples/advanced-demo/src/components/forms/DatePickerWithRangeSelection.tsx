import React from "react";

export const DatePickerWithRangeSelection: React.FC = () => (
    <div style={{ marginBottom: "15px" }}>
        <input
            type="date"
            style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                marginRight: "10px",
            }}
        />
        <input
            type="date"
            style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
            }}
        />
    </div>
);
