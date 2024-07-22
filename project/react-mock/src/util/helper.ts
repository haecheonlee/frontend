export function debounceByAnimationFrame(fn: FrameRequestCallback) {
    let requestId = -1;
    return function (): void {
        cancelAnimationFrame(requestId);
        requestAnimationFrame(fn);
    };
}
