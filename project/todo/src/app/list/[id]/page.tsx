import { TypographyH1 } from "@/components/ui/typography";

export default function Page({ params }: { params: { id: string } }) {
    return (
        <div className="mb-10">
            <TypographyH1>{params.id}</TypographyH1>
        </div>
    );
}
