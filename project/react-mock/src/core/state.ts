class State<T> {
    private state: T;

    constructor(initialState: T) {
        this.state = initialState;
    }

    public getState(): T {
        return this.state;
    }

    public setState(newState: T): void {
        this.state = newState;
    }
}

export { State };
