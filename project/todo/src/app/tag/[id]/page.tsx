import ViewList from "@/app/ui/tag/view-list";

export default function Page({ params }: { params: { id: string } }) {
    return <ViewList id={params.id} />;
}
