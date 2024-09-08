import { TypographyH3, TypographyXSmall } from "@/components/ui/typography";
import NavLinks from "./nav-links";

export default function SideNav() {
    return (
        <div className="bg-[#313131] p-4 rounded-md">
            <div className="flex items-stretch mb-5">
                <TypographyH3>Menu</TypographyH3>
            </div>
            <div>
                <TypographyXSmall>TASKS</TypographyXSmall>
                <NavLinks />
            </div>
        </div>
    );
}
