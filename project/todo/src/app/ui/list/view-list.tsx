"use client";

import { TypographyH1, TypographySmall } from "@/components/ui/typography";
import { getTypeById } from "@/utils/local-storage";
import { notFound } from "next/navigation";
import Container from "@/app/ui/task/container";
import TaskLink from "@/app/ui/task/task-link";

export default function ViewList({ id }: { id: string }) {
    const [type, todoList] = getTypeById(id);

    if (!type) {
        notFound();
    }

    return (
        <>
            <div className="mb-10">
                <div className="flex items-center">
                    <TypographyH1>
                        <span style={{ color: type.color }}>{type.title}</span>
                    </TypographyH1>
                </div>
            </div>
            <Container hideLink>
                {todoList.length === 0 && (
                    <div className="text-center">
                        <TypographySmall>
                            You have no tasks related to this list!
                        </TypographySmall>
                    </div>
                )}
                {todoList.length !== 0 &&
                    todoList.map((todo) => (
                        <TaskLink key={todo.id} todo={todo} />
                    ))}
            </Container>
        </>
    );
}
