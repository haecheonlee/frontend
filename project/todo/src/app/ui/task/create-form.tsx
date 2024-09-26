"use client";

import { Input } from "@/components/ui/input";
import ErrorLabel from "./error-label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "../date-picker";
import { Button } from "@/components/ui/button";
import { Tag, TaskActionState, Type } from "@/types/types";
import { addTodo, getTags, getTypes } from "@/utils/local-storage";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

const initialState: TaskActionState = { message: null, errors: {} };

export default function CreateForm() {
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(
        addTodo,
        initialState
    );
    const [date, setDate] = useState<Date | undefined>(() => new Date());
    const [types, setTypes] = useState<Type[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

    const goBack = () => {
        router.push("/");
    };

    const handleSubmit = async (formData: FormData) => {
        formData.set("dueDate", date?.toString() ?? "");
        formData.set("tags", JSON.stringify(selectedTagIds));
        await formAction(formData);
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
                    className="mb-2"
                    aria-describedby="title-error"
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
                    placeholder="Write your task in detail here."
                    aria-describedby="description-error"
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
            <div className="flex mt-2 mb-2 gap-x-2">
                <div>
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
                <div>
                    <Select name="type" aria-describedby="type-error">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="none">None</SelectItem>
                                {types.map((type) => (
                                    <SelectItem value={type.id} key={type.id}>
                                        {type.title}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div id="type-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.type &&
                            state.errors.type.map((error: string) => (
                                <ErrorLabel key={error} message={error} />
                            ))}
                    </div>
                </div>
                <div>
                    {tags.map((tag) => (
                        <Toggle
                            value={tag.id}
                            key={tag.id}
                            style={{ backgroundColor: tag.background }}
                            variant="outline"
                            className="mr-1"
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
                    Create
                </Button>
            </div>
        </form>
    );
}
