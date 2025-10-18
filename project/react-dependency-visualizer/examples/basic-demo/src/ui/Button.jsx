import React from "react";
import { Icon } from "./Icon";

export const Button = () => (
    <button
        style={{ padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
    >
        <Icon />
        Click Me
    </button>
);
