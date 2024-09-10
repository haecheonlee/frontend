"use client";

import { z } from "zod";
import { v4 } from "uuid";
import { TaskActionState } from "@/types/types";
import { redirect } from "next/navigation";

const TODO_KEY = "todos";

const TypeSchema = z.object({
    id: z.string(),
    title: z.string(),
    color: z.string(),
});

const TagSchema = z.object({
    id: z.string(),
    title: z.string(),
    background: z.string(),
});

const CreateTodo = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    dueDate: z.string(),
    type: TypeSchema.optional(),
    tags: z.array(TagSchema).optional(),
});

export function getTodoList() {
    const todoList = localStorage.getItem(TODO_KEY);
    return todoList ? JSON.parse(todoList) : [];
}

export function saveTodo(_: TaskActionState, formData: FormData) {
    const validatedFields = CreateTodo.safeParse({
        id: v4(),
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Todo.",
        };
    }

    const { data: todo } = validatedFields;
    const todoList = getTodoList();
    localStorage.setItem(TODO_KEY, JSON.stringify([...todoList, todo]));

    redirect("/");
}
