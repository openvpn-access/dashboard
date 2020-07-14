import {session} from '@state/session';
import {users} from '@state/users';
import {DBUser} from '../../../../api/types';
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

    return (
        <div className={styles.userList}
             data-hide={hide}>
            {list.map((value, index) => (
                value.id !== currentUser.user?.id && <User user={value} key={index}/>
            ))}
        </div>
    );
};
