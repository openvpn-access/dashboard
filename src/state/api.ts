/* eslint-disable @typescript-eslint/no-unsafe-return */

import {session} from '@state/modules/session';
import {APIError} from '@state/types';

export const api = <T>(
    method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH',
    route: string,
    data?: unknown
): Promise<T> => {
    const {token} = session.store.getState();

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

export const extractAPIError = (err: null | APIError, ...codes: Array<number>): string | null => {
    return err && codes.includes(err.id) ? err.message : null;
};
