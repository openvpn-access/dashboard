/* eslint-disable @typescript-eslint/no-unsafe-return */

import {sessionStore} from '@state/session';

export type APIError = {
    statusCode: number;
    message: string;
    error: string;
}

export const api = <T>(route: string, data: unknown): Promise<T> => {
    const {token} = sessionStore.getState();

    return fetch(env.API_ENDPOINT + route, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            ...(token && {'Authentication': `Baerer ${token}`})
        }
    }).then(async res => {
        return res.ok ? res.json() : Promise.reject(await res.json());
    });
};
