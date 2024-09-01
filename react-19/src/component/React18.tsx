"use client";

import { navigate } from "@/actions";
import { useState } from "react";

function updateName(name: string) {
    return new Promise<string>((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve("");
            }, 1000);
        } catch (e) {
            if (e instanceof Error) {
                reject(e.message);
            } else {
                reject("error");
            }
        }
    });
}

export function Action18() {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async () => {
        setIsPending(true);
        const error = await updateName(name);
        setIsPending(false);

        if (error) {
            setError(error);
            return;
        }

        navigate("/path");
    };

    return (
        <div>
            <input
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <button onClick={handleSubmit} disabled={isPending}>
                Update
            </button>
            {error && <p>Error</p>}
        </div>
    );
}
