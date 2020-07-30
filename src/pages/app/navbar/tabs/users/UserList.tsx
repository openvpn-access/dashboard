import {DBUser} from '@api/types';
import {LoadingIndicator} from '@components/LoadingIndicator';
import {session} from '@state/session';
import {users} from '@state/users';
import {createNativeEventContainer} from '@utils/events';
import {useStore} from 'effector-react';
import {createRef, Fragment, FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {User} from './User';
import styles from './UserList.module.scss';

type Props = {
    infiniteScroll?: boolean;
}

export const UserList: FunctionalComponent<Props> = props => {
    const [list, setList] = useState<Array<DBUser>>([]);
    const [nextPageLoading, setNextPageLoading] = useState(false);
    const [hide, setHide] = useState(false);
    const filters = useStore(users.filters.state);
    const currentUser = session.store.getState();
    const listEl = createRef();

    // Update list whenever the user changes filters
    useEffect(() => {
        users.items.state.watch(state => {
            setHide(true);

            setTimeout(() => {
                setList(state);
                setHide(false);
            }, 250);
        });
    }, []);

    // Infinite scroll implementation
    useEffect(() => {
        if (props.infiniteScroll && listEl.current) {
            const events = createNativeEventContainer();

            events.on(listEl.current, 'scroll', (e: MouseEvent) => {
                const {scrollTop, offsetHeight, scrollHeight} = e.target as HTMLDivElement;
                const diff = scrollHeight - Math.ceil(scrollTop + offsetHeight);

                // Only one page is left so pre-load the next one
                if (!nextPageLoading && diff < offsetHeight) {
                    setNextPageLoading(true);

                    users.items.next()
                        .finally(() => setNextPageLoading(false));
                }
            });

            return events.unbind;
        }
    }, [props.infiniteScroll]);

    const items = list.map((value, index) => (
        value.id !== currentUser.user?.id && <User user={value} key={index}/>
    ));

    return (
        <div className={styles.userList}
             data-empty={items.length === 0}
             data-hide={hide && !setNextPageLoading}
             ref={listEl}>
            {items}

            <div className={styles.loader}>
                <LoadingIndicator visible={nextPageLoading}/>
            </div>

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
