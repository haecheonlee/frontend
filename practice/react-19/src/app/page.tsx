import { Selector } from "@/component/Common";
import { Action18 } from "@/component/React18";
import {
    Action19,
    OptimisticComponent,
    UseComponent,
} from "@/component/React19";

export default function Home() {
    return (
        <main>
            <div>
                <p>Action:</p>
                <Selector react18={<Action18 />} react19={<Action19 />} />
            </div>
            <div>
                <span>useOptimistic</span>
                <OptimisticComponent />
            </div>
            <div>
                <span>use</span>
                <UseComponent />
            </div>
        </main>
    );
}
