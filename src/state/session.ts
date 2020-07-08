import {api} from '@state/api';
import {staticStore} from '@utils/static-store';
import {createStore, createEvent, createEffect} from 'effector';

export type User = {
    created_at: Date;
    updated_at: Date;
    type: 'admin' | 'user';
    state: 'activated' | 'pending' | 'deactivated';
    email: string;
    username: string;
};

export type Session = {
    token: string | null;
    user: User | null;
};

export type LoginEvent = {
    id: string;
    password: string;
} | {token: string};

// Export events
export const session = {
    logout: createEvent('logout'),
    login: createEffect<LoginEvent, Session>('login', {
        async handler(params) {
            return api('/login', params)
                .then(res => res as Session);
        }
    })
};

// Create store
export const sessionStore = createStore<Session>({
    token: null,
    user: null
});

// Bind events
sessionStore.on(session.logout, state => {
    staticStore.delete('token');
    const newState = {...state};
    newState.token = null;
    newState.user = null;
    return newState;
});

sessionStore.on(session.login.done, (_, payload) => {
    staticStore.setJSON('token', payload.result.token);
    return payload.result;
});
