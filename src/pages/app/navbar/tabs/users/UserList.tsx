import {DBUser} from '@api/types';
import {session} from '@state/session';
import {users} from '@state/users';
import {useStore} from 'effector-react';
import {Fragment, FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {User} from './User';
import styles from './UserList.module.scss';

export const UserList: FunctionalComponent = () => {
    const [list, setList] = useState<Array<DBUser>>([]);
    const [hide, setHide] = useState(false);
    const filters = useStore(users.filters.state);
    const currentUser = session.store.getState();

    useEffect(() => {
        users.items.state.watch(state => {
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
                {filters.search ?
                    <Fragment>
                        <h1>No results...</h1>
                        <p>Try a different query or tweak your filters!</p>
                    </Fragment> :
                    <Fragment>
                        <h1>Empty here huh?</h1>
                        <p>Press the + button to add a new user!</p>
                    </Fragment>
                }
            </div>
        </div>
    );
};
