"use client";

import { Input } from "@/components/ui/input";
import ErrorLabel from "./error-label";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "../date-picker";
import { Button } from "@/components/ui/button";
import { TaskActionState } from "@/types/types";
import { addTodo } from "@/utils/local-storage";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

const initialState: TaskActionState = { message: null, errors: {} };

export default function CreateForm() {
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(
        addTodo,
        initialState
    );
    const [date, setDate] = useState<Date | undefined>(() => new Date());

    const goBack = () => {
        router.push("/");
    };

    const handleSubmit = async (formData: FormData) => {
        formData.set("dueDate", date?.toString() ?? "");
        await formAction(formData);
    };

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
            <div className="flex mt-2 mb-2">
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
