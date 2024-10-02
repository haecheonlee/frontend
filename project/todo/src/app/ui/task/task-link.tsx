"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TypographySmall } from "@/components/ui/typography";
import { AppContext } from "@/context/AppContext";
import { Todo } from "@/types/types";
import { removeTodo } from "@/utils/local-storage";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export default function TaskLink({ todo }: { todo: Todo }) {
    const pathname = usePathname();
    const context = useContext(AppContext);

    return (
        <div className="flex items-center">
            <Checkbox
                className="border-white mr-2 checked:bg-white"
                onCheckedChange={(checked) => {
                    if (checked) {
                        context.setForceToRenderSidebar((p) => !p);
                        removeTodo(todo.id, pathname);
                    }
                }}
            />
            <Link
                href={`/${todo.id}/edit`}
                className="flex-1 pt-1 pb-1 flex border-b border-neutral-500 hover:bg-neutral-700"
            >
                <div className="flex-auto">
                    <TypographySmall>{todo.title}</TypographySmall>
                </div>
                <div className="justify-self-end self-center">
                    <ChevronRightIcon />
                </div>
            </Link>
        </div>
    );
}
