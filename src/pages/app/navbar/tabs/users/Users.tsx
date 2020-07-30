import {users} from '@state/users';
import {useStore} from 'effector-react';
import {FunctionalComponent, h} from 'preact';
import {useEffect} from 'preact/hooks';
import {Header} from './Header';
import {Paginator} from './paginator/Paginator';
import {SearchBar} from './SearchBar';
import {UserList} from './UserList';
import styles from './Users.module.scss';

export const Users: FunctionalComponent = () => {
    const filters = useStore(users.filters.state);

    // If theres is any option set which limits the amount of result, switch to infinite-scroll
    const infiniteScroll = !!(
        filters.type ||
        filters.activated ||
        filters.email_verified
    );

    useEffect(() => {
        if (infiniteScroll) {
            users.filters.update({page: 1});
            void users.items.refresh();
        }
    }, [infiniteScroll]);

    return (
        <div className={styles.users}>
            <SearchBar/>

            <div className={styles.table}>
                <Header/>
                <UserList infiniteScroll={infiniteScroll}/>
            </div>

            {!infiniteScroll && <Paginator/>}
        </div>
    );
};
