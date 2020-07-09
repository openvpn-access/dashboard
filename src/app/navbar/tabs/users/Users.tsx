import {FunctionalComponent, h} from 'preact';
import {SearchBar} from './SearchBar';
import {UserList} from './UserList';
import styles from './Users.module.scss';

export const Users: FunctionalComponent = () => (
    <div className={styles.users}>
        <SearchBar/>

        <div className={styles.table}>
            <UserList/>
        </div>
    </div>
);
