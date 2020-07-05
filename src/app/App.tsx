import {FunctionalComponent, h} from 'preact';
import styles from './App.module.scss';
import {NavBar} from './navbar/NavBar';

export const App: FunctionalComponent = () => (
    <div className={styles.app}
         role="application">
        <NavBar/>
    </div>
);
