import {createStore, createEvent} from 'effector';

export type User = {
    id: string;
    email: string;
};

export type Session = {
    sessionKey: string | null;
    user: User | null;
};

// Export events
export const session = {
    logout: createEvent('logout')
};

// Create store
export const sessionStore = createStore<Session>({
    sessionKey: 'hello world',
    user: null
});

// Bind events
sessionStore.on(session.logout, state => {
    const newState = {...state};
    newState.sessionKey = null;
    newState.user = null;
    return newState;
});
