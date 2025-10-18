import React from "react";
import { Badge } from "../../ui/Badge";

export const SidebarWithCollapsibleMenu = () => (
    <aside
        style={{
            width: "250px",
            background: "#f8fafc",
            padding: "20px",
            borderRight: "1px solid #e2e8f0",
        }}
    >
        <h3>Menu</h3>
        <div style={{ marginBottom: "10px" }}>
            Dashboard <Badge />
        </div>
        <div style={{ marginBottom: "10px" }}>Users</div>
        <div style={{ marginBottom: "10px" }}>
            Settings <Badge />
        </div>
    </aside>
);
