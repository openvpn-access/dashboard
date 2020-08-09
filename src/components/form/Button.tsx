import {cn} from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import {LoadingIndicator} from '../LoadingIndicator';
import styles from './Button.module.scss';

type Props = {
    ariaLabel?: string;
    disabled?: boolean;
    className?: string;
    icon?: string;
    submit?: boolean;
    type?: 'primary' | 'red' | 'yellow';
    loading?: boolean;
    onClick?: () => void;
    text: string;
};

export const Button: FunctionalComponent<Props> = props => {
    return (
        <button className={cn(styles.button, props.className)}
                disabled={props.disabled || props.loading}
                aria-label={props.ariaLabel}
                role={props.loading ? 'progressbar' : 'button'}
                data-loading={props.loading}
                data-type={props.type || 'primary'}
                onClick={() => !props.disabled && props.onClick?.()}
                type={props.submit ? 'submit' : 'button'}>
            {props.icon && <bc-icon name={props.icon}/>}
            <span>{props.text}</span>

            {props.loading !== undefined && <LoadingIndicator visible={props.loading}/>}
        </button>
    );
};
