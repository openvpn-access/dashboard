import {users} from '@state/users';
import {eventPath} from '@utils/event-path';
import {createNativeEventContainer} from '@utils/events';
import {useStore} from 'effector-react';
import {createRef, FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './PerPageButton.module.scss';

export const PerPageButton: FunctionalComponent = () => {
    const {per_page} = useStore(users.searchConfig);
    const [showPages, setShowPages] = useState(false);
    const listEl = createRef<HTMLDivElement>();

    const setPageSize = (per_page: number) => () => {
        setShowPages(false);
        users.updateConfig({per_page});
        void users.updateView();
    };

    const pageSizes = [100, 50, 25, 15, 10]
        .filter(v => v !== per_page)
        .map((v, i) =>
            <button key={i}
                    onClick={setPageSize(v)}
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
                    onClick={() => setShowPages(!showPages)}
                    aria-label="Change amount of users per page">
                {per_page}
            </button>
        </div>
    );
};
