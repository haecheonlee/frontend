import { TypographyH1 } from "@/components/ui/typography";
import CreateForm from "@/app/ui/task/create-form";

export default function Page() {
    return (
        <>
            <div className="mb-10">
                <TypographyH1>Create a task</TypographyH1>
            </div>
            <CreateForm />
        </>
    );
}
