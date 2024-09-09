import { TypographyH3, TypographySmall } from "@/components/ui/typography";

export default function NotFound() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="text-center">
                <TypographyH3>404 Page Not Found</TypographyH3>
                <TypographySmall>
                    Oops! The page you are looking for does not exist.
                </TypographySmall>
            </div>
        </div>
    );
}
