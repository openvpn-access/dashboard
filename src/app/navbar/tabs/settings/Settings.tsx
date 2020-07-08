import {FunctionalComponent, h} from 'preact';
import styles from './Settings.module.scss';
import {UpdateCredentials} from './UpdateCredentials';

export const Settings: FunctionalComponent = () => (
    <div className={styles.settings}>
        <UpdateCredentials/>
    </div>
);
