import {PopoverContainer} from '@lib/popover';
import {h} from 'preact';
import styles from './App.module.scss';
import {NavBar} from './navbar/NavBar';
import {Login} from './overlays/Login';
import './popovers';

export default () => (
    <div className={styles.app}
         role="application">

        {/* Main App */}
        <NavBar/>

        {/* Overlays */}
        <Login/>

        {/* Popovers */}
        {<PopoverContainer/>}
    </div>
);
