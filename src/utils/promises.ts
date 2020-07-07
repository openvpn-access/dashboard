/**
 * Returns a promise which resolves after a specified amount of time in milliseconds
 * @param t
 */
export const delay = async <T>(t: number) =>
    new Promise<T>(resolve => setTimeout(resolve, t));

/**
 * Waits at least t milliseconds and returns the result of promise p
 * @param t
 * @param p
 */
export const delayPromise = async <T>(t: number, p: Promise<T>): Promise<T> => {
    return Promise
        .allSettled([p, delay(t)])
        .then(([res]) =>
            res.status === 'fulfilled' ?
                Promise.resolve(res.value) :
                Promise.reject(res.reason)
        );
};
