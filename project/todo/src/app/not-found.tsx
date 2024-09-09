import { TypographyH1, TypographySmall } from "@/components/ui/typography";

export default function NotFound() {
    return (
        <>
            <div className="mb-5">
                <TypographyH1>404 Page Not Found</TypographyH1>
            </div>
            <TypographySmall>
                Oops! The page you are looking for does not exist.
            </TypographySmall>
        </>
    );
}
