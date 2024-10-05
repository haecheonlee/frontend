"use client";

import { TaskActionState } from "@/types/types";
import { addTodo } from "@/utils/local-storage";
import { useRouter } from "next/navigation";
import { useActionState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import FormTask from "./form-task";

const initialState: TaskActionState = { message: null, errors: {} };

export default function CreateTask() {
    const router = useRouter();
    const context = useContext(AppContext);

    const [state, formAction, isPending] = useActionState(
        addTodo,
        initialState
    );

    const goBack = () => {
        router.push("/");
    };

    const handleSubmit = async (
        formData: FormData,
        date: Date,
        selectedTagIds: string[]
    ) => {
        formData.set("dueDate", date.toString());
        formData.set("tags", JSON.stringify(selectedTagIds));
        await formAction(formData);
        context.setForceToRenderSidebar((p) => !p);
    };

    return (
        <FormTask
            state={state}
            isPending={isPending}
            submitLabel="Create"
            handleSubmit={handleSubmit}
            goBack={goBack}
        />
    );
}
