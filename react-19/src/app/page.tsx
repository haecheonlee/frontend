import { Selector } from "@/component/Common";
import { Action18 } from "@/component/React18";
import { Action19 } from "@/component/React19";

export default function Home() {
    return (
        <main>
            <Selector react18={<Action18 />} react19={<Action19 />} />
        </main>
    );
}
