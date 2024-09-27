"use client";

import { TypographyH1, TypographySmall } from "@/components/ui/typography";
import Container from "@/app/ui/task/container";
import TaskLink from "@/app/ui/task/task-link";
import { useEffect, useState } from "react";
import { Todo } from "@/types/types";
import { getTodoList } from "@/utils/local-storage";

export default function Page() {
    const [todoList, setTodoList] = useState<Todo[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setTodoList(() =>
                getTodoList().sort(
                    (a, b) =>
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                )
            );
        }
    }, []);

    return (
        <>
            <div className="mb-10">
                <TypographyH1>Upcoming</TypographyH1>
            </div>
            <Container title="Tasks">
                {todoList.length === 0 && (
                    <div className="text-center">
                        <TypographySmall>
                            You have no tasks at the moment! 🎉
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
