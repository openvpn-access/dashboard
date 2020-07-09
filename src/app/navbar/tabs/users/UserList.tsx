import {users} from '@state/modules/users';
import {useStore} from 'effector-react';
import {FunctionalComponent, h} from 'preact';
import {User} from './User';
import styles from './UserList.module.scss';

export const UserList: FunctionalComponent = () => {
    const userList = useStore(users.list);

    return (
        <div className={styles.userList}>
            {userList.map((value, index) => (
                <User user={value} key={index}/>
            ))}
        </div>
    );
};
