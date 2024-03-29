import {api} from '@api/index';
import {createDomain} from 'effector';

export type ListStoreItem = {
    id: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ListStoreFilter = {
    page: number;
    per_page: number;
};

/**
 * Creates a new, classic store to insert, update and manipulate a list of database items (much convenient!).
 * @param endpoint
 * @param init
 */
export function linkTable<Item extends ListStoreItem, Filters extends ListStoreFilter, Stats>(
    endpoint: string,
    init: {
        items: Array<Item>;
        filters: Filters;
        stats: Stats;
    }
) {
    const domain = createDomain(name);
    const reset = domain.createEvent(`${endpoint}-reset`);

    /* eslint-disable no-use-before-define */
    const items = {
        state: domain.createStore<Array<Item>>(init.items),

        // Insert a new item
        insert: domain.createEffect<Partial<Item>, Item>(`${endpoint}-items-insert`, {
            handler(params: Partial<Item>): Promise<Item> {
                return api({
                    method: 'PUT',
                    route: endpoint,
                    data: params
                });
            }
        }),

        // Update an item
        update: domain.createEffect<[Partial<Item>, number], Item>(`${endpoint}-items-update`, {
            handler([params, id]: [Partial<Item>, number]): Promise<Item> {
                return api({
                    method: 'PATCH',
                    route: `${endpoint}/${id}`,
                    data: params
                });
            }
        }),

        // Delete an item
        delete: domain.createEffect<number, void>(`${endpoint}-items-delete`, {
            handler(params: number): Promise<void> | void {
                return api({
                    method: 'DELETE',
                    route: `${endpoint}/${params}`
                });
            }
        }),

        // Refresh list
        refresh: domain.createEffect<void, Array<Item>>(`${endpoint}-items-refresh`, {
            async handler(): Promise<Array<Item>> {
                return await api({
                    route: endpoint,
                    query: filters.state.getState()
                });
            }
        }),

        // Append next page
        next: domain.createEffect<void, Array<Item>>(`${endpoint}-items-next`, {
            async handler(): Promise<Array<Item>> {
                const query = filters.state.getState();
                const items = await api<Array<Item>>({
                    route: endpoint, query
                });

                if (items.length) {
                    filters.update({
                        page: query.page + 1
                    } as Partial<Filters>); // Why in hell do I need to cast this???
                }

                return items;
            }
        })
    };

    items.state
        .on(items.update.done, (state, payload) => {
            return state.map(value => {
                return value.id === payload.result.id ? payload.result : value;
            });
        })
        .on(items.delete.done, (state, payload) => {
            return state.filter(value => value.id !== payload.params);
        })
        .on(items.refresh.done, (_, payload) => {
            return payload.result;
        })
        .on(items.next.done, (state, payload) => {
            return [...state, ...payload.result];
        })
        .reset(reset);

    const filters = {
        state: domain.createStore<Filters>(init.filters),
        update: domain.createEvent<Partial<Filters>>()
    };

    filters.state
        .on(filters.update, (state, payload) => {
            return {...state, ...payload};
        })
        .reset(reset);

    const stats = {
        state: domain.createStore<Stats>(init.stats),
        refresh: domain.createEffect<void, Stats>({
            handler(): Promise<Stats> | Stats {
                return api({route: '/users/stats'});
            }
        })
    };

    stats.state
        .on(stats.refresh.done, (_, payload) => {
            return payload.result;
        })
        .reset(reset);

    return {items, filters, stats, reset};
}
