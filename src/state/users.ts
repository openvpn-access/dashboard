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
