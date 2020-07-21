import {users} from '@state/users';
import {useStore} from 'effector-react';
import {FunctionalComponent, h} from 'preact';
import {PageBar} from './PageBar';
import styles from './Paginator.module.scss';
import {PerPageButton} from './PerPageButton';

export const Paginator: FunctionalComponent = () => {
    const {search, per_page} = useStore(users.filters.state);
    const {total_users_count} = useStore(users.stats.state);
    const totalPages = Math.ceil(total_users_count / per_page);

    return (
        <div className={styles.paginator}
             data-visible={!search && totalPages > 1}>
            <PerPageButton/>
            <PageBar/>
            <div/>
        </div>
    );
};
