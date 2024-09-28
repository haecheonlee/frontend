import { Checkbox } from "@/components/ui/checkbox";
import { TypographySmall } from "@/components/ui/typography";
import { Todo } from "@/types/types";
import { removeTodo } from "@/utils/local-storage";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function TaskLink({ todo }: { todo: Todo }) {
    return (
        <div className="flex items-center">
            <Checkbox
                className="border-white mr-2 checked:bg-white"
                onCheckedChange={(checked) =>
                    checked ? removeTodo(todo.id) : null
                }
            />
            <Link
                href={`/${todo.id}/edit`}
                className="flex-1 pt-1 pb-1 flex border-b border-neutral-500 hover:bg-neutral-700"
            >
                <div className="flex-auto">
                    <TypographySmall>{todo.title}</TypographySmall>
                </div>
                <div className="justify-self-end self-center w-[30px]">
                    <ChevronRightIcon />
                </div>
            </Link>
        </div>
    );
}
