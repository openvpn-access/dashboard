import {cn} from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import styles from './Button.module.scss';

type Props = {
    ariaLabel?: string;
    disabled?: boolean;
    className?: string;
    icon?: string;
    type?: 'primary' | 'red' | 'yellow';
    onClick: () => void;
    text: string;
};

export const Button: FunctionalComponent<Props> = props => {
    return (
        <button className={cn(styles.button, props.className)}
                disabled={props.disabled}
                aria-label={props.ariaLabel}
                data-type={props.type || 'primary'}
                onClick={() => !props.disabled && props.onClick()}>
            {props.icon && <bc-icon name={props.icon}/>}
            <span>{props.text}</span>
        </button>
    );
};
