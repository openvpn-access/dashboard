import {cn} from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import styles from './InputField.module.scss';

type Props = {
    ariaLabel?: string;
    className?: string;
    password?: boolean;
    icon?: string;
    disabled?: boolean;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
};

export const InputField: FunctionalComponent<Props> = props => {
    const changeProxy = (e: Event) => {
        props.onChange((e.target as HTMLInputElement).value);
    };

    return (
        <div className={cn(styles.inputField, props.className)}>
            {props.icon && <bc-icon name={props.icon}/>}
            <input type={props.password ? 'password' : 'text'}
                   placeholder={props.placeholder}
                   aria-label={props.ariaLabel}
                   onInput={changeProxy}
                   disabled={props.disabled}/>
        </div>
    );
};
