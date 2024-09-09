import { TypographyH3 } from "@/components/ui/typography";

export default function Container({
    title,
    children,
}: Readonly<{
    title: string;
    children?: React.ReactNode;
}>) {
    return (
        <div className="p-4 border border-neutral-500 rounded-md">
            <div className="mb-2">
                <TypographyH3>{title}</TypographyH3>
            </div>
            {children}
        </div>
    );
}
