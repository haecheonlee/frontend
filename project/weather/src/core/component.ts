export abstract class Component {
    private element: HTMLElement | null = null;
    private selectorId: string = "";

    constructor(selectorId: string) {
        this.selectorId = selectorId;
    }

    abstract render(): string;

    mount() {
        this.element = document.getElementById(this.selectorId);
        if (this.element) {
            this.element.innerHTML = this.render();
        }
    }

    unmount() {
        if (this.element) {
            this.element.innerHTML = "";
            this.element = null;
            this.selectorId = "";
        }
    }
}
