import {cn} from '@utils/preact-utils';
import {h} from 'preact';
import styles from './Checkbox.module.scss';

type AllowedValues<T> = T extends true ? boolean | null : boolean;

type Props<T extends boolean> = {
    ariaLabel?: string;
    className?: string;
    disabled?: boolean;
    value: AllowedValues<T>;
    allowIndeterminate?: T;
    onChange: (state: AllowedValues<T>, ev: MouseEvent) => void;
};

export const Checkbox = <T extends boolean = false>(props: Props<T>) => {

    // Handle click events
    const click = (ev: MouseEvent) => {
        const {value, allowIndeterminate, onChange} = props;

        if (allowIndeterminate) {
            onChange((
                value === null ? true :
                    value === true ? false : null
            ) as AllowedValues<T>, ev);
        } else {
            onChange(!value as AllowedValues<T>, ev);
        }
    };

    return (
        <button role="checkbox"
                type="button"
                disabled={props.disabled}
                aria-label={props.ariaLabel}
                onClick={click}
                data-state={String(props.value)}
                className={cn(styles.checkbox, props.className)}>
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 50 50">
                <path d="M7,25L17.571,38,44,12"/>
            </svg>
        </button>
    );
};
