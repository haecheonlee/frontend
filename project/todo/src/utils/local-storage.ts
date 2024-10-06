"use client";

import { z } from "zod";
import { v4 } from "uuid";
import {
    TagActionState,
    TaskActionState,
    Todo,
    Category,
    CategoryType,
} from "@/types/types";
import { redirect } from "next/navigation";
import chroma from "chroma-js";
import { getLabelByCategoryType } from "@/lib/utils";

const TODO_KEY = "todos";
const TYPE_KEY = "type";
const TAG_KEY = "tag";

const CategorySchema = z.object({
    id: z.string(),
    title: z.string().min(1, { message: "Title is required." }),
    color: z.string(),
});

const CreateTodo = z.object({
    id: z.string(),
    title: z.string().min(1, { message: "Title is required." }),
    description: z.string(),
    dueDate: z.string(),
    type: z.string().nullable(),
    tags: z.array(z.string()).optional(),
});

const validateTags = (tags: FormDataEntryValue | null): tags is string =>
    typeof tags === "string";

export function getTodoList(): Todo[] {
    const todoList = localStorage.getItem(TODO_KEY);
    return todoList ? JSON.parse(todoList) : [];
}

export function getTodoById(id: string) {
    const todoList = getTodoList();
    return todoList.find((p) => p.id === id);
}

export function addTodo(_: TaskActionState, formData: FormData) {
    const tags = formData.get("tags");
    const validatedFields = CreateTodo.safeParse({
        id: v4(),
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
        type: formData.get("type"),
        tags: validateTags(tags) ? JSON.parse(tags) : [],
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

export function editTodo(
    previousUrl: string,
    _: TaskActionState,
    formData: FormData
) {
    const tags = formData.get("tags");
    const validatedFields = CreateTodo.safeParse({
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("dueDate"),
        type: formData.get("type"),
        tags: validateTags(tags) ? JSON.parse(tags) : [],
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

    redirect(previousUrl);
}

export function removeTodo(id: string, pathname: string) {
    const updatedList = getTodoList().filter((p) => p.id !== id);
    localStorage.setItem(TODO_KEY, JSON.stringify(updatedList));

    redirect(pathname);
}

export function getCategories(categoryType: CategoryType): Category[] {
    const list = localStorage.getItem(
        categoryType === "TYPE" ? TYPE_KEY : TAG_KEY
    );
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

export function addCategory(
    pathname: string,
    categoryType: CategoryType,
    _: TagActionState,
    formData: FormData
) {
    const validatedFields = CategorySchema.safeParse({
        id: v4(),
        title: formData.get("title")?.toString().trim(),
        color: chroma.random().hex(),
    });

    const categoryLabel = getLabelByCategoryType(categoryType);
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: `Missing Fields. Failed to Create ${categoryLabel}.`,
        };
    }

    const existingCategories = getCategories(categoryType);
    const newCategory = validatedFields.data;

    if (
        existingCategories.some(
            (category) =>
                category.title.toLowerCase() === newCategory.title.toLowerCase()
        )
    ) {
        return {
            errors: {
                title: [`${newCategory.title} already exists.`],
            },
            message: `Failed to Create ${categoryLabel}.`,
        };
    }

    localStorage.setItem(
        categoryType === "TAG" ? TAG_KEY : TYPE_KEY,
        JSON.stringify([...existingCategories, newCategory])
    );
    redirect(pathname);
}

export function getCategoryById(
    id: string,
    categoryType: CategoryType
): [Category | null, Todo[]] {
    const category = getCategories(categoryType).find(
        (category) => category.id === id
    );

    if (!category) {
        return [null, []];
    }

    const todos = getTodoList();
    const filteredTodos =
        categoryType === "TYPE"
            ? todos.filter((todo) => todo.type === id)
            : todos.filter((todo) => todo.tags?.includes(id));

    return [category, filteredTodos];
}
