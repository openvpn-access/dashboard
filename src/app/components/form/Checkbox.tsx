import {cn} from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import styles from './Checkbox.module.scss';

type Props = {
    ariaLabel?: string;
    className?: string;
    value: boolean;
    onChange: (state: boolean, ev: MouseEvent) => void;
};

export const Checkbox: FunctionalComponent<Props> = props => (
    <button role="checkbox"
            aria-label={props.ariaLabel}
            onClick={(ev: MouseEvent) => props.onChange(!props.value, ev)}
            className={cn(styles.checkbox, props.className, {
                [styles.checked]: props.value
            })}>
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 50 50">
            <path d="M7,25L17.571,38,44,12"/>
        </svg>
    </button>
);
