"use client";

import { JSX, useState } from "react";

interface ISelectorProps {
    react18: JSX.Element;
    react19: JSX.Element;
}

export function Selector({ react18, react19 }: ISelectorProps) {
    const [status, setStatus] = useState<"REACT_18" | "REACT_19">("REACT_18");

    const toggleStatus = () => {
        setStatus((prevStatus) =>
            prevStatus === "REACT_18" ? "REACT_19" : "REACT_18"
        );
    };

    return (
        <div>
            <button onClick={toggleStatus}>{status.replace("_", " ")}</button>
            <div>{status === "REACT_18" ? react18 : react19}</div>
        </div>
    );
}
