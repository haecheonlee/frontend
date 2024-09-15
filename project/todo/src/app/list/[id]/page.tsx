import ViewList from "@/app/ui/list/view-list";

export default function Page({ params }: { params: { id: string } }) {
    return <ViewList id={params.id} />;
}
