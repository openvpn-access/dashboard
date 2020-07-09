import {api} from '@state/api';
import {users} from '@state/modules/users';
import {DBUser} from '@state/types';
import {staticStore} from '@utils/static-store';
import {createDomain} from 'effector';

export type Session = {
    token: string;
    user: DBUser;
};

export type StoredSession = {
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

    // Session store with current user and api-token
    store: domain.createStore<StoredSession>({
        token: null,
        user: null
    }),

    // Logout event
    logout: domain.createEvent('logout'),

    // Login effect using username / email and password
    login: domain.createEffect<LoginEvent, Session>('login', {
        async handler(params) {
            return api({method: 'POST', route: '/login', data: params})
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
    .on(session.login.done, (_, {result}) => {
        staticStore.setJSON('token', result.token);
        return result;
    })
    .on(session.login.doneData, state => {

        // Update user list
        if (state.user?.type === 'admin') {
            void users.updateView();
            void users.updateStats();
        }
    });
