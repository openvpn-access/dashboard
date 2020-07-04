import {FunctionalComponent, h} from 'preact';
import styles from './App.module.scss';

export const App: FunctionalComponent = () => (
    <div className={styles.app}
         role="application">
        Hello World
    </div>
);
