import {session} from '@state/session';
import {useStore} from 'effector-react';
import {Fragment, FunctionalComponent, h} from 'preact';
import {InfoBar} from './InfoBar';
import styles from './Settings.module.scss';
import {UpdateCredentials} from './UpdateCredentials';

export const Settings: FunctionalComponent = () => {
    const {user} = useStore(session.store);

    return (
        <div className={styles.settings}>
            {user && <Fragment>
                <InfoBar user={user}/>
                <div className={styles.divider}/>
            </Fragment>}

            <UpdateCredentials/>
        </div>
    );
};
