import ViewTag from "@/app/ui/tag/view-tag";

export default function Page({ params }: { params: { id: string } }) {
    return <ViewTag id={params.id} />;
}
