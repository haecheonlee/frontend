import React from "react";
import { Card } from "@/components/Card";
import Sidebar from "@/layout/Sidebar";
import { UserProfile } from "@/features/user/UserProfile";

const Dashboard = () => (
    <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "20px" }}>
            <UserProfile />
            <Card />
            <Card />
        </main>
    </div>
);

export default Dashboard;
