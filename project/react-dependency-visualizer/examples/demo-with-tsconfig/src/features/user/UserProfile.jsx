import React from "react";
import { Avatar } from "@/ui/Avatar";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

export const UserProfile = () => (
    <div
        style={{
            padding: "20px",
            background: "#fff",
            borderRadius: "8px",
            marginBottom: "20px",
        }}
    >
        <Avatar />
        <h2>Name</h2>
        <Badge />
        <p>Job Description</p>
        <Button />
    </div>
);
