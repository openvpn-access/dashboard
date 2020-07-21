import {api} from '@api/index';
import {DBUser} from '@api/types';
import {linkTable} from '@state/models/Table';

type Item = DBUser;

type Filters = {
    page: number;
    per_page: number;
    sort: string;
    sort_dir: 'asc' | 'desc';
    search?: string;
};

type Stats = {
    total_users_count: number;
};

export const users = linkTable<Item, Filters, Stats>('/users', {
    items: [],

    filters: {
        page: 1,
        per_page: 25,
        sort: 'id',
        sort_dir: 'asc',
        search: undefined
    },

    stats: {
        total_users_count: -1
    }
});

export const isUserAccountLocked = async (username: string): Promise<boolean> => {
    return api<Array<{created_at: number}>>({
        route: '/login-attempts/web',
        query: {
            sort: 'created_at',
            sort_dir: 'desc',
            state: 'fail',
            username,
            per_page: 5
        }
    }).then(value => {

        // This user has not enough failed login-attempts
        if (value.length < 5) {
            return false;
        }

        // Check if the last entry is within the timestamp of an account to get locked
        const lastEntry = value[value.length - 1];
        const lastEntryDate = new Date(lastEntry.created_at);
        return lastEntryDate.getTime() > (Date.now() - env.config.security.loginAttemptsTimeRange * 1000);
    });
};
