import {api} from '../api';
import {DBUser} from '@api/types';
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

    // Search configuration and filters
    searchConfig: domain.createStore<UsersConfig>({
        page: 1,
        per_page: 25
    }),

    // Search query
    searchQuery: domain.createStore<string | null>(null),

    // Update (/ add) or remove a single user locally
    updateUser: domain.createEvent<DBUser>('updateUser'),
    removeUser: domain.createEvent<string>('removeUser'),

    // Update current view
    updateView: domain.createEffect<void, UsersList>('updateView', {
        async handler(): Promise<UsersList> {
            const searchConfig = users.searchConfig.getState();
            const searchQuery = users.searchQuery.getState();

            if (searchQuery) {
                return await api({
                    method: 'POST',
                    route: '/users/search',
                    data: {
                        term: searchQuery,
                        limit: searchConfig.per_page
                    }
                });
            }
                return await api({
                    route: '/users',
                    query: users.searchConfig.getState()
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
    updateConfig: domain.createEvent<Partial<UsersConfig>>('updateConfig'),

    // Update search query
    updateSearchQuery: domain.createEvent<string>('updateSearchQuery')
};

// Bind events
users.searchConfig
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

users.list
    .on(users.updateUser, (state, payload) => {
        for (const item of state) {
            if (item.id === payload.id) {
                Object.assign(item, payload);
                return state;
            }
        }

        return [...state, payload];
    });

users.list
    .on(users.removeUser, (state, payload) => {
        return state.filter(v => v.username !== payload);
    });

users.searchQuery
    .on(users.updateSearchQuery, (state, payload) => {
        return payload || null;
    });
