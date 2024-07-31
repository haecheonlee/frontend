import { _render } from "./ui";
import { State } from "./state";

let currentState: Array<State<any>> = [] as const;
let currentIndex = 0;
let currentEffect: Array<{ dependencies: any[]; cleanup?: () => void }> =
    [] as const;
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
        _render();
    };

    currentIndex += 1;
    return [stateInstance.getState(), setState];
}

export function useEffect(
    fn: () => undefined | (() => void),
    dependencies: any[]
) {
    const currentIndex = currentEffectIndex;
    let isFirst = false;

    if (currentEffect[currentIndex] === undefined) {
        isFirst = true;
        currentEffect[currentIndex] = { dependencies };
    }

    const hasDependenciesChanged = dependencies.some(
        (dependency, index) =>
            dependency !== currentEffect[currentIndex].dependencies[index]
    );

    if (hasDependenciesChanged || isFirst) {
        if (currentEffect[currentIndex].cleanup) {
            currentEffect[currentIndex].cleanup();
        }
        const cleanup = fn();
        currentEffect[currentIndex] = { dependencies, cleanup };
    }
}
