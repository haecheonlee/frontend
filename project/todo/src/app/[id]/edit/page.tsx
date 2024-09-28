import EditForm from "@/app/ui/task/edit-task";
import { TypographyH1 } from "@/components/ui/typography";

export default function Page({ params }: { params: { id: string } }) {
    return (
        <>
            <div className="mb-10">
                <TypographyH1>Edit a task</TypographyH1>
            </div>
            <EditForm id={params.id} />
        </>
    );
}
