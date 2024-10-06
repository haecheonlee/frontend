import { CategoryType } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toTitleCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getLabelByCategoryType(categoryType: CategoryType) {
    return categoryType === "TAG" ? "Tag" : "List";
}
