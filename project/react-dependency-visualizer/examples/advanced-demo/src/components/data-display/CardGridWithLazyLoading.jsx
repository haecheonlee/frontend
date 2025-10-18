import React from "react";
import Card from "../../ui/Card";

export const CardGridWithLazyLoading = () => (
    <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
        }}
    >
        <Card />
        <Card />
        <Card />
        <Card />
    </div>
);
