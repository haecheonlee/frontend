import { v } from "@/core/framework";
import { debounce } from "@/util/helper";

interface ISearchComponentProps {
    onChangeCallback: (value: string) => void;
}

function SearchComponent(props: ISearchComponentProps) {
    return v("input", {
        id: "search-component",
        type: "text",
        onkeyup: debounce(function (event: Event) {
            if (event.target instanceof HTMLInputElement) {
                props.onChangeCallback(event.target.value);
            }
        }, 1000),
    });
}

export { SearchComponent };
