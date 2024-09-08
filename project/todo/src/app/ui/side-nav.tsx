import { TypographyH3, TypographyXSmall } from "@/components/ui/typography";
import NavLinks from "./nav-links";
import HorizontalDivider from "./horizontal-divider";

export default function SideNav() {
    return (
        <div className="bg-neutral-800 p-4 rounded-md">
            <div className="flex items-stretch mb-5">
                <TypographyH3>Menu</TypographyH3>
            </div>
            <div>
                <TypographyXSmall isUppercase>Tasks</TypographyXSmall>
                <NavLinks />
            </div>
            <HorizontalDivider />
            <div>
                <TypographyXSmall isUppercase>Lists</TypographyXSmall>
            </div>
            <HorizontalDivider />
            <div>
                <TypographyXSmall isUppercase>Tag</TypographyXSmall>
            </div>
        </div>
    );
}
