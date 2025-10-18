import React from "react";

export const DropdownSelectWithSearch = React.forwardRef((props, ref) => (
    <div style={{ marginBottom: "15px" }}>
        <select
            ref={ref}
            style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
            }}
        >
            <option>Select option...</option>
            <option>Option 1</option>
            <option>Option 2</option>
        </select>
    </div>
));
