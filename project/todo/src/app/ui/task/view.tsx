import { TypographySmall } from "@/components/ui/typography";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export default function View({ title }: { title: string }) {
    return (
        <div className="mb-1 pb-1 flex border-b border-neutral-500 ">
            <div className="flex-auto">
                <TypographySmall>{title}</TypographySmall>
            </div>
            <div className="justify-self-end self-center w-[30px]">
                <ChevronRightIcon />
            </div>
        </div>
    );
}
