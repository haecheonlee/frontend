import React from "react";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

export const Card = () => (
    <div
        style={{
            padding: "20px",
            border: "1px solid gray",
            marginBottom: "10px",
            borderRadius: "8px",
        }}
    >
        <h2>Card Title</h2>
        <Badge />
        <p>This is a card component with some content.</p>
        <Button />
    </div>
);
