import {users} from '@state/modules/users';
import {useStore} from 'effector-react';
import {FunctionalComponent, h} from 'preact';
import styles from './Paginator.module.scss';

// TODO: Pagination-spinner whatever animation?
const PAD = 2;
export const Paginator: FunctionalComponent = () => {
    const {page, per_page} = useStore(users.config);
    const {total_users_count} = useStore(users.stats);

    const jumpTo = (page: number) => () => {
        users.updateConfig({page});
        void users.updateView(); // TODO: Show loading indicator?
    };

    const totalPages = Math.ceil(total_users_count / per_page);
    const buttons = [];

    for (let i = page - PAD; i <= page + PAD; i++) {
        buttons.push(i);
    }

    const pad = Math.max(2, String(buttons[buttons.length - 1]).length);
    return (
        <div className={styles.paginator}
             data-visible={per_page > total_users_count}>
            <div className={styles.controls}>
                <button aria-label="Jump to first page"
                        disabled={page === 1}
                        onClick={jumpTo(1)}>
                    First
                </button>

                {buttons.map((value, index) =>
                    <button key={index}
                            aria-label={`Jump to page ${index}`}
                            onClick={jumpTo(value)}
                            data-invisible={value <= 0 || value > totalPages}
                            data-current={value === page}
                            className={styles.number}>
                        {String(value).padStart(pad, '0')}
                    </button>
                )}

                <button aria-label="Jump to last page"
                        disabled={page === totalPages}
                        onClick={jumpTo(totalPages)}>
                    Last
                </button>
            </div>
        </div>
    );
};