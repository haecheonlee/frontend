"use client";

import { navigate } from "@/actions";
import { useActionState } from "react";

function updateName(_: string) {
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

export function Action19() {
    const [error, submitAction, isPending] = useActionState(
        async (state: any, payload: any) => {
            const error = await updateName(payload.get("name"));
            if (error) {
                return error;
            }
            navigate("/path");
        },
        null
    );

    return (
        <form action={submitAction}>
            <input type="text" name="name" />
            <button type="submit" disabled={isPending}>
                Update
            </button>
            {error && <p>{error}</p>}
        </form>
    );
}
