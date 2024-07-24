import { render } from "./render";
import { State } from "./state";

let currentState: Array<State<any>> = [] as const;
let currentIndex = 0;
let currentEffect: Array<{ dependencies: any[] }> = [] as const;
let currentEffectIndex = 0;

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
        currentEffectIndex = 0;
        render();
    };

    currentIndex += 1;
    return [stateInstance.getState(), setState];
}

export function useEffect(fn: () => void, dependencies: any[]) {
    const currentIndex = currentEffectIndex;

    if (currentEffect[currentIndex] === undefined) {
        currentEffect[currentIndex] = { dependencies };
    }

    const hasDependenciesChanged = dependencies.some(
        (dependency, index) =>
            dependency !== currentEffect[currentIndex].dependencies[index]
    );

    if (hasDependenciesChanged) {
        fn();
        currentEffect[currentIndex] = { dependencies };
    }
}
