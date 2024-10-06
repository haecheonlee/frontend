import { TypographyH1, TypographySmall } from "@/components/ui/typography";
import { getLabelByCategoryType, toTitleCase } from "@/lib/utils";
import Container from "../task/container";
import TaskLink from "../task/task-link";
import { Category, CategoryType, Todo } from "@/types/types";

export default function ViewCategory({
    category,
    todoList,
    categoryType,
}: {
    category: Category;
    todoList: Todo[];
    categoryType: CategoryType;
}) {
    const label = getLabelByCategoryType(categoryType).toLowerCase();

    return (
        <>
            <div className="mb-10">
                <div className="flex items-center">
                    <TypographyH1>
                        <span style={{ color: category.color }}>{`${toTitleCase(
                            label
                        )}: ${toTitleCase(category.title)}`}</span>
                    </TypographyH1>
                </div>
            </div>
            <Container hideLink>
                {todoList.length === 0 && (
                    <div className="text-center">
                        <TypographySmall>
                            You have no tasks related to this {label}!
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
