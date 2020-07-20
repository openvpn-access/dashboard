/* eslint-disable @typescript-eslint/no-unsafe-return */

import {session} from '@state/session';

export * from './enums/ErrorCode';
export * from './enums/Status';

export type APICallConfig = {
    method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
    route: string;
    data?: unknown;
    query?: Record<string, string | number | null | undefined>
};

export const api = <T>(
    {
        method = 'GET',
        route,
        data,
        query
    }: APICallConfig
): Promise<T> => {
    const {token} = session.store.getState();
    let queryString = '';

    if (query) {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(query)) {
            if (value !== null && value !== undefined) {
                params.append(key, String(value));
            }
        }

        queryString = `?${params.toString()}`;
    }

    const url = env.API_ENDPOINT + route + queryString;
    return fetch(url, {
        method,
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
        headers: {
            'Content-Type': 'application/json',
            ...(token && {'Authorization': `Bearer ${token}`})
        }
    }).then(async res => {
        let process: 'json' | 'text' = 'text';

        if (res.headers.get('content-type')?.includes('application/json')) {
            process = 'json';
        }

        return res.ok ? res[process]() : Promise.reject(await res[process]());
    });
};
