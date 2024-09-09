"use client";

import { Todo } from "@/types/types";

const TODO_KEY = "todos";

export function getTodoList() {
    const todoList = localStorage.getItem(TODO_KEY);
    return todoList ? JSON.parse(todoList) : [];
}

export function saveTodo(todo: Todo) {
    const todoList = getTodoList();
    localStorage.setItem(TODO_KEY, JSON.stringify([...todoList, todo]));
}
