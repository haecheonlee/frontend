import React from "react";
import { Icon } from "@/ui/Icon";

export const SearchBar = () => (
    <div style={{ display: "inline-block", marginLeft: "20px" }}>
        <Icon />
        <input
            type="text"
            placeholder="Search..."
            style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #ddd",
            }}
        />
    </div>
);
