import {PopoverContainer} from '@lib/popover';
import {session} from '@state/session';
import {h} from 'preact';
import {route} from 'preact-router';
import styles from './App.module.scss';
import {NavBar} from './navbar/NavBar';
import './popovers';

export default () => {

    // Redirect to login page if user hasn't been resolved yet
    const s = session.store.getState();
    if (!s.token || !s.user) {
        route('/login');
    }

    return (
        <div className={styles.app}
             role="application">

            {/* Main App */}
            <NavBar/>

            {/* Popovers */}
            {<PopoverContainer/>}
        </div>
    );
};
