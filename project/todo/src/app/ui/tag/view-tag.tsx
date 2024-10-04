"use client";

import { TypographyH1, TypographySmall } from "@/components/ui/typography";
import { getTagById } from "@/utils/local-storage";
import { notFound } from "next/navigation";
import Container from "@/app/ui/task/container";
import TaskLink from "@/app/ui/task/task-link";
import { toTitleCase } from "@/lib/utils";

export default function ViewTag({ id }: { id: string }) {
    const [tag, todoList] = getTagById(id);

    if (!tag) {
        notFound();
    }

    return (
        <>
            <div className="mb-10">
                <div className="flex items-center">
                    <TypographyH1>
                        <span style={{ color: tag.color }}>{`Tag: ${toTitleCase(
                            tag.title
                        )}`}</span>
                    </TypographyH1>
                </div>
            </div>
            <Container hideLink>
                {todoList.length === 0 && (
                    <div className="text-center">
                        <TypographySmall>
                            You have no tasks related to this tag!
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
