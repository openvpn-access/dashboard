import {blankRequest} from '@state/api';
import {createStore, createEvent, createEffect} from 'effector';

export type User = {
    id: string;
    email: string;
};

export type Session = {
    key: string | null;
    user: User | null;
};

export type LoginEvent = {
    id: string;
    password: string;
};

// Export events
export const session = {
    logout: createEvent('logout'),
    login: createEffect<LoginEvent, Session>('login', {
        async handler(params) {
            return blankRequest('/login', params)
                .then(res => res as Session)
                .catch(err => {
                    throw err.message;
                });
        }
    })
};

// Create store
export const sessionStore = createStore<Session>({
    key: null,
    user: null
});

// Bind events
sessionStore.on(session.logout, state => {
    const newState = {...state};
    newState.key = null;
    newState.user = null;
    return newState;
});

sessionStore.on(session.login.done, (_, payload) => {
    return payload.result;
});
