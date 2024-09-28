import { TypographyH1 } from "@/components/ui/typography";
import CreateTask from "@/app/ui/task/create-task";

export default function Page() {
    return (
        <>
            <div className="mb-10">
                <TypographyH1>Create a task</TypographyH1>
            </div>
            <CreateTask />
        </>
    );
}
