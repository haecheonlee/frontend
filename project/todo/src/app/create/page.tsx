"use client";

import { TypographyH1 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "../ui/date-picker";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(() => new Date());

    const goBack = () => {
        router.push("/");
    };

    return (
        <>
            <div className="mb-10">
                <TypographyH1>Create a task</TypographyH1>
            </div>
            <form>
                <Input
                    name="title"
                    type="text"
                    placeholder="New task"
                    className="mb-2"
                />
                <Textarea
                    name="description"
                    placeholder="Write your task in detail here."
                />
                <div className="flex mt-2 mb-2">
                    <DatePicker date={date} setDate={setDate} />
                </div>
                <div className="flex justify-end gap-1">
                    <Button type="button" onClick={goBack}>
                        Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                </div>
            </form>
        </>
    );
}
