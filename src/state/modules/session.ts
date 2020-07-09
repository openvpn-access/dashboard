import {api} from '@state/api';
import {DBUser} from '@state/types';
import {staticStore} from '@utils/static-store';
import {createDomain} from 'effector';

export type Session = {
    token: string | null;
    user: DBUser | null;
};

export type LoginEvent = {
    id: string;
    password: string;
} | {token: string};

// Session domain
const domain = createDomain('session');
export const session = {
    store: domain.createStore<Session>({
        token: null,
        user: null
    }),

    logout: domain.createEvent('logout'),

    login: domain.createEffect<LoginEvent, Session>('login', {
        async handler(params) {
            return api('POST', '/login', params)
                .then(res => res as Session);
        }
    })
};

// Bind events
session.store
    .on(session.logout, state => {
        staticStore.delete('token');
        const newState = {...state};
        newState.token = null;
        newState.user = null;
        return newState;
    })
    .on(session.login.done, (_, payload) => {
        staticStore.setJSON('token', payload.result.token);
        return payload.result;
    });
