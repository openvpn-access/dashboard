import {FunctionalComponent, h} from 'preact';
import styles from './IconButton.module.scss';

type Props = {
    icon: string;
    title: string;
    onClick: () => void;
    ariaLabel?: string;
}

export const IconButton: FunctionalComponent<Props> = props => (
    <button className={styles.iconButton}
            aria-label={props.ariaLabel || props.title}
            onClick={props.onClick}>
        <bc-tooltip content={props.title}/>
        <bc-icon name={props.icon}/>
    </button>
);
