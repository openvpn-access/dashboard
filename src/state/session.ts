import {DBUser} from '@api/types';
import {users} from '@state/users';
import {staticStore} from '@utils/static-store';
import {createDomain} from 'effector';
import {api} from '../api';

export type Session = {
    token: string;
    user: DBUser;
};

export type StoredSession = {
    token: string | null;
    user: DBUser | null;
};

export type LoginEvent = {
    login_id: string;
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

    // Update the user object
    updateUser: domain.createEvent<Partial<DBUser>>('update-user'),

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

        // Invalidate session token server-side
        void api({method: 'POST', route: '/logout'});

        // Clear user-list
        users.reset();

        // Remove session token from localStorage
        staticStore.delete('token');

        // Clear user and token
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
            void users.items.refresh();
            void users.stats.refresh();
        }
    })
    .on(session.updateUser, (state, payload) => {
        return {
            token: state.token,
            user: state.user ? {...state.user, ...payload} : null
        };
    });

