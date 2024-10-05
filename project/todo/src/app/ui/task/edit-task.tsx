"use client";

import { TaskActionState } from "@/types/types";
import { getTodoById, editTodo } from "@/utils/local-storage";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useActionState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import FormTask from "./form-task";

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

    const goBack = () => {
        router.push(previousUrl);
    };

    const handleSubmit = async (
        formData: FormData,
        date: Date,
        selectedTagIds: string[]
    ) => {
        formData.set("id", id);
        formData.set("dueDate", date.toString());
        formData.set("tags", JSON.stringify(selectedTagIds));
        await formAction(formData);
        context.setForceToRenderSidebar((p) => !p);
    };

    return (
        <FormTask
            state={state}
            isPending={isPending}
            initialTodo={todo}
            submitLabel="Edit"
            handleSubmit={handleSubmit}
            goBack={goBack}
        />
    );
}
