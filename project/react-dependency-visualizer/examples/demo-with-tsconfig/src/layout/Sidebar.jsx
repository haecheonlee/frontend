import React from "react";
import { NavItem } from "@/components/NavItem";
import { Badge } from "@/ui/Badge";

const Sidebar = () => (
    <aside style={{ width: "200px", padding: "20px", background: "#f5f5f5" }}>
        <h3>Navigation</h3>
        <NavItem />
        <NavItem />
        <NavItem />
        <Badge />
    </aside>
);

export default Sidebar;
