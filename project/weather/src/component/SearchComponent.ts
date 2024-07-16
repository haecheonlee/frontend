import { v } from "@/core/framework";
import { debounce } from "@/util/helper";

interface ISearchComponentProps {
    value: string;
    onChangeCallback: (value: string) => void;
}

function SearchComponent(props: ISearchComponentProps) {
    return v("input", {
        id: "search-component",
        type: "text",
        value: props.value,
        onkeyup: debounce(function (event: Event) {
            if (event.target instanceof HTMLInputElement) {
                props.onChangeCallback(event.target.value);
            }
        }, 1000),
    });
}

export { SearchComponent };
