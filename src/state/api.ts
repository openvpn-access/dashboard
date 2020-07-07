/* eslint-disable @typescript-eslint/no-unsafe-return */

export const blankRequest = <T>(route: string, data: unknown): Promise<T> => {
    return fetch(env.API_ENDPOINT + route, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async res => {
        return res.ok ? res.json() : Promise.reject(await res.json());
    });
};
