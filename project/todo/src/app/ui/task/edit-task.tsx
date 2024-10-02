"use client";

import { Input } from "@/components/ui/input";
import ErrorLabel from "./error-label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "../date-picker";
import { Button } from "@/components/ui/button";
import { Tag, TaskActionState, Type } from "@/types/types";
import {
    getTodoById,
    editTodo,
    getTypes,
    getTags,
} from "@/utils/local-storage";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useActionState, useContext, useEffect, useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { AppContext } from "@/context/AppContext";

const initialState: TaskActionState = { message: null, errors: {} };

export default function EditTask({ id }: { id: string }) {
    const todo = getTodoById(id);

    if (!todo) {
        notFound();
    }

    const router = useRouter();
    const pathname = usePathname();
    const context = useContext(AppContext);
    const previousUrl =
        context.previousUrls.findLast((p) => p !== pathname) ?? "/";

    const editTodoWithPreviousUrl = editTodo.bind(null, previousUrl);
    const [state, formAction, isPending] = useActionState(
        editTodoWithPreviousUrl,
        initialState
    );
    const [date, setDate] = useState<Date | undefined>(
        () => new Date(todo.dueDate)
    );
    const [types, setTypes] = useState<Type[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
        () => todo.tags ?? []
    );

    const goBack = () => {
        router.push(previousUrl);
    };

    const handleSubmit = async (formData: FormData) => {
        formData.set("id", id);
        formData.set("dueDate", date?.toString() ?? "");
        formData.set("tags", JSON.stringify(selectedTagIds));
        await formAction(formData);
        context.setForceToRenderSidebar((p) => !p);
    };

    useEffect(() => {
        setTypes(getTypes());
        setTags(getTags());
    }, []);

    return (
        <form action={handleSubmit}>
            <div>
                <Input
                    name="title"
                    type="text"
                    placeholder="New task"
                    className="mb-2 text-base md:text-sm"
                    aria-describedby="title-error"
                    defaultValue={todo.title}
                />
                <div id="title-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.title &&
                        state.errors.title.map((error: string) => (
                            <ErrorLabel key={error} message={error} />
                        ))}
                </div>
            </div>
            <div>
                <Textarea
                    name="description"
                    className="text-base md:text-sm"
                    placeholder="Write your task in detail here."
                    aria-describedby="description-error"
                    defaultValue={todo.description}
                />
                <div
                    id="description-error"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {state.errors?.description &&
                        state.errors.description.map((error: string) => (
                            <ErrorLabel key={error} message={error} />
                        ))}
                </div>
            </div>
            <div className="mt-2 mb-2 gap-x-2">
                <div className="flex gap-x-2 mb-2">
                    <div className="flex-1">
                        <DatePicker
                            date={date}
                            setDate={setDate}
                            aria-describedby="due-date-error"
                        />
                        <div
                            id="due-date-error"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {state.errors?.dueDate &&
                                state.errors.dueDate.map((error: string) => (
                                    <ErrorLabel key={error} message={error} />
                                ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <Select
                            name="type"
                            aria-describedby="type-error"
                            defaultValue={todo.type ?? undefined}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {types.map((type) => (
                                        <SelectItem
                                            value={type.id}
                                            key={type.id}
                                        >
                                            {type.title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div
                            id="type-error"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {state.errors?.type &&
                                state.errors.type.map((error: string) => (
                                    <ErrorLabel key={error} message={error} />
                                ))}
                        </div>
                    </div>
                </div>
                <div className="mb-2 lg:mb-0">
                    {tags.map((tag) => (
                        <Toggle
                            value={tag.id}
                            key={tag.id}
                            style={{ backgroundColor: tag.color }}
                            variant="outline"
                            className="mr-1 mb-1 truncate max-w-[100px] inline"
                            onPressedChange={(pressed) => {
                                if (pressed) {
                                    setSelectedTagIds((ids) =>
                                        ids.concat(tag.id)
                                    );
                                } else {
                                    setSelectedTagIds((ids) =>
                                        ids.filter((id) => id !== tag.id)
                                    );
                                }
                            }}
                            defaultPressed={
                                todo.tags?.includes(tag.id) ?? false
                            }
                        >
                            {tag.title}
                        </Toggle>
                    ))}
                    <div id="tag-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.type &&
                            state.errors.type.map((error: string) => (
                                <ErrorLabel key={error} message={error} />
                            ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-1">
                <Button
                    type="button"
                    onClick={goBack}
                    disabled={isPending}
                    aria-disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    aria-disabled={isPending}
                >
                    Edit
                </Button>
            </div>
        </form>
    );
}
