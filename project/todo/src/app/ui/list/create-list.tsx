"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TypographySmall } from "@/components/ui/typography";
import { ListActionState } from "@/types/types";
import { addType } from "@/utils/local-storage";
import { PlusIcon } from "@radix-ui/react-icons";
import { useActionState } from "react";
import ErrorLabel from "@/app/ui/task/error-label";

const initialState: ListActionState = { message: null, errors: {} };

export default function CreateList() {
    const [state, formAction, isPending] = useActionState(
        addType,
        initialState
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-transparent flex items-center justify-start rounded-none w-full px-1 py-2 hover:bg-neutral-700">
                    <PlusIcon className="w-4 h-4 mr-4" />
                    <TypographySmall>Add New List</TypographySmall>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[350px] sm:max-w-[425px] bg-black">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Add List</DialogTitle>
                        <DialogDescription>
                            Click save to add a list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid items-center gap-4">
                            <Input
                                name="title"
                                className="col-span-3 text-base md:text-sm"
                                placeholder="Title"
                                disabled={isPending}
                                aria-disabled={isPending}
                            />
                        </div>
                        <div
                            id="title-error"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {state.errors?.title &&
                                state.errors.title.map((error: string) => (
                                    <ErrorLabel key={error} message={error} />
                                ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isPending}
                            aria-disabled={isPending}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
