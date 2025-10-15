import React from "react";
import { Button } from "../ui/Button";
import { SearchBar } from "../features/search/SearchBar";

export const Header = () => (
    <header style={{ padding: "20px", borderBottom: "2px solid #ddd" }}>
        <h1>My Application</h1>
        <SearchBar />
        <Button />
    </header>
);
