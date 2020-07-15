import {session} from '@state/session';
import {DBUser} from '@api/types';
import {users} from '@state/users';
import {FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {User} from './User';
import styles from './UserList.module.scss';

export const UserList: FunctionalComponent = () => {
    const [list, setList] = useState<Array<DBUser>>([]);
    const [hide, setHide] = useState(false);
    const currentUser = session.store.getState();

    useEffect(() => {
        users.list.watch(state => {
            setHide(true);

            setTimeout(() => {
                setList(state);
                setHide(false);
            }, 250);
        });
    }, []);

    const items = list.map((value, index) => (
        value.id !== currentUser.user?.id && <User user={value} key={index}/>
    ));

    return (
        <div className={styles.userList}
             data-empty={items.length === 0}
             data-hide={hide}>
            {items}

            {/* TODO: Make this more beautiful */}
            <div className={styles.placeholder}>
                <h1>Empty here huh?</h1>
                <p>Press the + button to add a new user!</p>
            </div>
        </div>
    );
};
