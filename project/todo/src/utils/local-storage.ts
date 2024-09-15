"use client";

import { z } from "zod";
import { v4 } from "uuid";
import { ListActionState, TaskActionState, Todo, Type } from "@/types/types";
import { redirect } from "next/navigation";
import chroma from "chroma-js";

const TODO_KEY = "todos";
const TYPE_KEY = "type";

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
    type: z.string(),
    tags: z.array(TagSchema).optional(),
});

export function getTodoList(): Todo[] {
    const todoList = localStorage.getItem(TODO_KEY);
    return todoList ? JSON.parse(todoList) : [];
}

export function getTodoById(id: string) {
    const todoList = getTodoList();
    return todoList.find((p) => p.id === id);
}

export function addTodo(_: TaskActionState, formData: FormData) {
    const validatedFields = CreateTodo.safeParse({
        id: v4(),
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
        type: formData.get("type"),
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

export function editTodo(_: TaskActionState, formData: FormData) {
    const validatedFields = CreateTodo.safeParse({
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
        type: formData.get("type"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Edit Todo.",
        };
    }

    const { data: todo } = validatedFields;
    const updatedList = getTodoList().map((p) => {
        if (p.id === todo.id) {
            return todo;
        }

        return p;
    });
    localStorage.setItem(TODO_KEY, JSON.stringify(updatedList));

    redirect("/");
}

export function getTypes(): Type[] {
    const list = localStorage.getItem(TYPE_KEY);
    return list ? JSON.parse(list) : [];
}

export function getTodoCountByTypes(typeIds: string[]): {
    [typeId: string]: number;
} {
    const todos = getTodoList();

    return typeIds.reduce((acc, id) => {
        return {
            ...acc,
            [id]: todos.filter((todo) => todo.type === id).length,
        };
    }, {});
}

export function addType(_: ListActionState, formData: FormData) {
    const validatedFields = TypeSchema.safeParse({
        id: v4(),
        title: formData.get("title"),
        color: chroma.random().hex(),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Type.",
        };
    }

    const type = validatedFields.data;
    localStorage.setItem(TYPE_KEY, JSON.stringify([...getTypes(), type]));

    redirect("/");
}

export function getTypeById(id: string): [Type | undefined, Todo[]] {
    const type = getTypes().find((type) => type.id === id);
    const todos = getTodoList().filter((todo) => todo.type === id);

    return [type, todos];
}
