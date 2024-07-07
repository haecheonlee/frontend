import { State } from "./state";

let currentState: any[] = [];
let currentIndex = 0;

export function useState<T>(initialState: T): [T, (newState: T) => void] {
    if (currentState.length === currentIndex) {
        currentState.push(new State(initialState));
    }

    const stateInstance: State<T> = currentState[currentIndex];
    const setState = (newState: T) => {
        if (stateInstance.getState() === newState) {
            return;
        }

        stateInstance.setState(newState);
        currentIndex = 0;
    };

    currentIndex += 1;
    return [stateInstance.getState(), setState];
}

export function useEffect(fn: () => void, dependencies: any[]) {
    let hasMounted = false;
    let previousDependencies: typeof dependencies = [];

    return function () {
        const hasDependenciesHasChanged = dependencies.some(
            (currentDependency, index) =>
                currentDependency !== previousDependencies[index]
        );

        if (!hasMounted || hasDependenciesHasChanged) {
            fn();
            hasMounted = true;
            previousDependencies = dependencies.slice();
        }
    };
}
