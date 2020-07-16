/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Debounce function as provided by lodash, underscore.js and other utility libraries.
 * @param fn Function to execute
 * @param delay Minimum delay after calling the initial function
 */
export const debounce = <T extends (...args: any) => any>(fn: T, delay: number) => {
    let lastCall: number | null = null;
    let lastArgs: Parameters<T>;
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>): void => {
        const now = performance.now();

        if (!lastCall) {
            lastCall = now;
        }

        const diff = (now - lastCall);
        lastArgs = args;

        // Clear pending call
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        if (diff > delay) {

            // Call directly as the last call is far enough in the past
            fn(...(lastArgs as Array<unknown>));
        } else {

            // Delay for possible upcoming calls
            timeout = setTimeout(() => {
                fn(...(lastArgs as Array<unknown>));
                timeout = null;
                lastCall = now;
            }, delay - diff);
        }
    };
};
