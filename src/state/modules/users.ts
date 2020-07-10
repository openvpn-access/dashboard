import {api} from '@state/api';
import {DBUser} from '@state/types';
import {createDomain} from 'effector';

type UsersList = Array<DBUser>;
type UsersConfig = {
    page: number;
    per_page: number;
};

type UsersStats = {
    total_users_count: number;
};

// Session domain
const domain = createDomain('users');
export const users = {

    // Listed users
    list: domain.createStore<UsersList>([]),

    // User stats
    stats: domain.createStore<UsersStats>({
        total_users_count: -1
    }),

    // Search configuration
    config: domain.createStore<UsersConfig>({
        page: 20,
        per_page: 25
    }),

    // Update current view
    updateView: domain.createEffect<void, UsersList>('updateView', {
        async handler(): Promise<UsersList> {
            return await api({
                route: '/users',
                query: users.config.getState()
            });
        }
    }),

    // Update stats
    updateStats: domain.createEffect<void, UsersStats>('updateStats', {
        async handler(): Promise<UsersStats> {
            return await api({route: '/users/stats'});
        }
    }),

    // Update config effect
    updateConfig: domain.createEvent<Partial<UsersConfig>>('updateConfig')
};

// Bind events
users.config
    .on(users.updateConfig, (state, payload) => {
        return {...state, ...payload};
    });

users.stats
    .on(users.updateStats.done, (state, payload) => {
        return payload.result;
    });

users.list
    .on(users.updateView.done, (state, payload) => {
        return payload.result;
    });
