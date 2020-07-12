/* eslint-disable @typescript-eslint/no-unsafe-return */

import {session} from '@state/modules/session';
import {APIError} from '@state/types';

export type APICallConfig = {
    method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
    route: string;
    data?: unknown;
    query?: Record<string, string | number>
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
            params.append(key, String(value));
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
        if (res.headers.get('content-length') === '0') {
            return res.status;
        }

        return res.ok ? res.json() : Promise.reject(await res.json());
    });
};

export const extractAPIError = (err: null | APIError, map: Record<number, string>): string | null => {
    return (err && map[err.code]) || null;
};
