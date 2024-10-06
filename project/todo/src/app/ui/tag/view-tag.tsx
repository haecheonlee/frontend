"use client";

import { getCategoryById } from "@/utils/local-storage";
import { notFound } from "next/navigation";
import ViewCategory from "../common/view-category";

export default function ViewTag({ id }: { id: string }) {
    const [tag, todoList] = getCategoryById(id, "TAG");

    if (!tag) {
        notFound();
    }

    return (
        <>
            <ViewCategory
                category={tag}
                todoList={todoList}
                categoryType="TAG"
            />
        </>
    );
}
