"use client";

import { getCategoryById } from "@/utils/local-storage";
import { notFound } from "next/navigation";
import ViewCategory from "../common/view-category";

export default function ViewList({ id }: { id: string }) {
    const [type, todoList] = getCategoryById(id, "TYPE");

    if (!type) {
        notFound();
    }

    return (
        <ViewCategory category={type} todoList={todoList} categoryType="TYPE" />
    );
}
