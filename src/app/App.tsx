import {FunctionalComponent, h} from 'preact';
import {PopoverContainer} from '@popover';
import styles from './App.module.scss';
import {NavBar} from './navbar/NavBar';
import {Login} from './overlays/Login';
import './popovers';

export const App: FunctionalComponent = () => (
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
