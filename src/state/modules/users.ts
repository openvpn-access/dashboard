import {api} from '@state/api';
import {DBUser} from '@state/types';
import {createDomain} from 'effector';

type UserList = Array<DBUser>;
type UsersConfig = {
    page: number;
    per_page: number;
};

// Session domain
const domain = createDomain('users');
export const users = {

    // Listed users
    list: domain.createStore<UserList>([]),

    // Search configuration
    config: domain.createStore<UsersConfig>({
        page: 1,
        per_page: 25
    }),

    // Update config effect
    updateConfig: domain.createEvent<Partial<UsersConfig>>('updateConfig'),

    // Update current view
    updateView: domain.createEffect<void, UserList>('updateView', {
        async handler(): Promise<UserList> {
            return await api({
                route: '/user',
                query: users.config.getState()
            });
        }
    })
};

// Bind events
users.config
    .on(users.updateConfig, (state, payload) => {
        return {...state, ...payload};
    });

users.list
    .on(users.updateView.done, (state, payload) => {
        return payload.result;
    });
