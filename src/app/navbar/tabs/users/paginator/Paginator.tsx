import {users} from '@state/users';
import {useStore} from 'effector-react';
import {FunctionalComponent, h} from 'preact';
import {PageBar} from './PageBar';
import {PerPageButton} from './PerPageButton';
import styles from './Paginator.module.scss';

// TODO: Pagination-spinner whatever animation?
export const Paginator: FunctionalComponent = () => {
    const searchQuery = useStore(users.searchQuery);
    const {per_page} = useStore(users.searchConfig);
    const {total_users_count} = useStore(users.stats);
    const totalPages = Math.ceil(total_users_count / per_page);

    return (
        <div className={styles.paginator}
             data-visible={!searchQuery && totalPages > 1}>
            <PerPageButton/>
            <PageBar/>
            <div/>
        </div>
    );
};
