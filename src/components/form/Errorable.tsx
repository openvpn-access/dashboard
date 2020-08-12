import {FunctionalComponent, h} from 'preact';
import styles from './Errorable.module.scss';

type Props = {
    className?: string;
    onClick?: () => void;
    error?: string | boolean | null;
};

export const Errorable: FunctionalComponent<Props> = props => (
    <div className={styles.errorable}
         onClick={props.onClick}>
        <div className={props.className}>{props.children}</div>
        {props.error && <p className={styles.message}>{props.error}</p>}
    </div>
);
