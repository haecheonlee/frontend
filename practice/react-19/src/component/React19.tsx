"use client";

import { navigate } from "@/actions";
import { Suspense, use, useActionState, useOptimistic, useState } from "react";

function updateName(name: string) {
    return new Promise<string>((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(name);
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

function Optimistic({ currentName, onUpdateName }: any) {
    const [optimisticName, setOptimisticName] = useOptimistic(currentName);

    const submitAction = async (formDate: any) => {
        const newName = formDate.get("name");
        setOptimisticName(newName);
        const updatedName = await updateName(newName);
        onUpdateName(updatedName);
    };

    return (
        <form action={submitAction}>
            <p>Your name is: {optimisticName}</p>
            <p>
                <label>Change Name: </label>
                <input
                    type="text"
                    name="name"
                    disabled={currentName !== optimisticName}
                />
            </p>
        </form>
    );
}

function fetchPosts() {
    return new Promise((resolve) =>
        setTimeout(resolve, 1000, [
            {
                id: "1",
                body: "Post 1",
            },
            {
                id: "2",
                body: "Post 2",
            },
        ])
    );
}

function Post({ promise }: any) {
    const posts: any = use(promise);
    return posts.map((post: any) => <p key={post.id}>{post.body}</p>);
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

export function OptimisticComponent() {
    const [name, setName] = useState<string>("");

    return <Optimistic currentName={name} onUpdateName={setName} />;
}

export function UseComponent() {
    const [postPromise, setPostPromise] = useState<any>(null);
    const [show, setShow] = useState(false);

    function download() {
        setPostPromise(fetchPosts());
        setShow(true);
    }

    if (!show) {
        return <button onClick={download}>Download posts</button>;
    }

    return (
        <Suspense fallback={<p>Downloading posts...</p>}>
            <Post promise={postPromise} />
        </Suspense>
    );
}
