"use client";

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
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import ErrorLabel from "../task/error-label";
import { useActionState } from "react";
import { TagActionState } from "@/types/types";
import { addTag } from "@/utils/local-storage";

const initialState: TagActionState = { message: null, errors: {} };

export default function CreateTag() {
    const [state, formAction, isPending] = useActionState(addTag, initialState);

    return (
        <Dialog>
            <DialogTrigger asChild className="inline-block">
                <Button className="inline-flex items-center justify-center w-[90px] rounded-sm px-1 py-2 hover:bg-neutral-700">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    <TypographySmall>Add Tag</TypographySmall>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Add Tag</DialogTitle>
                        <DialogDescription>
                            Click save to add a tag.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid items-center gap-4">
                            <Input
                                name="title"
                                className="col-span-3"
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
