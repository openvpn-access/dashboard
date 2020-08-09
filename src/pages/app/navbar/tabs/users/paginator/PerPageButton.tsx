import {users} from '@state/users';
import {eventPath} from '@utils/event-path';
import {createNativeEventContainer} from '@utils/events';
import {useStore} from 'effector-react';
import {createRef, FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './PerPageButton.module.scss';

export const PerPageButton: FunctionalComponent = () => {
    const {total_users_count} = useStore(users.stats.state);
    const {per_page, page} = useStore(users.filters.state);
    const [showPages, setShowPages] = useState(false);
    const listEl = createRef<HTMLDivElement>();

    const setPageSize = (newPageSize: number) => () => {
        setShowPages(false);

        users.filters.update({
            per_page: newPageSize,
            page: Math.min(Math.ceil(total_users_count / newPageSize), page)
        });

        void users.items.refresh();
    };

    const pageSizes = [100, 50, 25, 15, 10]
        .filter(v => v !== per_page)
        .map((v, i) =>
            <button key={i}
                    onClick={setPageSize(v)}
                    type="button"
                    aria-label={`Show ${v} users per page`}>
                {v}
            </button>
        );

    useEffect(() => {
        const events = createNativeEventContainer();
        events.on(window, 'click', (e: MouseEvent) => {
            if (showPages && listEl.current && !eventPath(e).includes(listEl.current)) {
                setShowPages(false);
            }
        });

        return events.unbind;
    });

    return (
        <div className={styles.perPageButton} data-open={showPages}>
            <bc-tooltip content="Users per page"/>

            <div className={styles.list}
                 ref={listEl}>
                {pageSizes}
            </div>

            <button className={styles.btn}
                    type="button"
                    onClick={() => setShowPages(!showPages)}
                    aria-label="Change amount of users per page">
                {per_page}
            </button>
        </div>
    );
};
