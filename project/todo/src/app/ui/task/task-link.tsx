import { TypographySmall } from "@/components/ui/typography";
import { Todo } from "@/types/types";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function TaskLink({ todo }: { todo: Todo }) {
    return (
        <Link
            href={`/${todo.id}/edit`}
            className="pt-1 pb-1 flex border-b border-neutral-500 hover:bg-neutral-700"
        >
            <div className="flex-auto">
                <TypographySmall>{todo.title}</TypographySmall>
            </div>
            <div className="justify-self-end self-center w-[30px]">
                <ChevronRightIcon />
            </div>
        </Link>
    );
}
