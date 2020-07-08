/* eslint-disable @typescript-eslint/no-unsafe-return */

import {sessionStore} from '@state/session';

export type APIError = {
    statusCode: number;
    message: string;
    error: string;
    id: number;
};

export const api = <T>(
    method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH',
    route: string,
    data?: unknown
): Promise<T> => {
    const {token} = sessionStore.getState();

    return fetch(env.API_ENDPOINT + route, {
        method,
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
        headers: {
            'Content-Type': 'application/json',
            ...(token && {'Authorization': `Bearer ${token}`})
        }
    }).then(async res => {
        if (res.headers.get('content-length') === '0') {
            return res.status;
        }
            return res.ok ? res.json() : Promise.reject(await res.json());

    });
};
