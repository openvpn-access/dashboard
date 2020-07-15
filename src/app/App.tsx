import {FunctionalComponent, h} from 'preact';
import styles from './App.module.scss';
import {NavBar} from './navbar/NavBar';
import {Login} from './overlays/Login';
import {Popovers} from '@popover';

export const App: FunctionalComponent = () => (
    <div className={styles.app}
         role="application">

        {/* Main App */}
        <NavBar/>

        {/* Overlays */}
        <Login/>

        {/* Popovers */}
        {<Popovers/>}
    </div>
);
