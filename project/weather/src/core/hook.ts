import { State } from "./state";

let currentState: any[] = [];
let currentIndex = 0;

export function useState<T>(initialState: T): [T, (newState: T) => void] {
    const index = currentIndex++;

    if (currentState[index] === undefined) {
        currentState[index] = new State(initialState);
    }

    const stateInstance: State<T> = currentState[index];
    return [stateInstance.getState(), stateInstance.setState];
}
