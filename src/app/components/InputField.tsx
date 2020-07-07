import {cn} from '@utils/preact-utils';
import {createRef, FunctionalComponent, h} from 'preact';
import styles from './InputField.module.scss';

type Props = {
    ariaLabel?: string;
    className?: string;
    password?: boolean;
    icon?: string;
    disabled?: boolean;
    placeholder: string;
    value: string;
    onSubmit?: (v: string) => void;
    onChange: (v: string) => void;
};

export const InputField: FunctionalComponent<Props> = props => {
    const inputField = createRef<HTMLInputElement>();
    const getValue = () => inputField.current?.value || '';

    return (
        <div className={cn(styles.inputField, props.className)}>
            {props.icon && <bc-icon name={props.icon}/>}
            <input type={props.password ? 'password' : 'text'}
                   ref={inputField}
                   placeholder={props.placeholder}
                   aria-label={props.ariaLabel}
                   value={props.value}
                   onInput={() => props.onChange(getValue())}
                   onKeyUp={e => e.key === 'Enter' && props.onSubmit?.(getValue())}
                   disabled={props.disabled}/>
        </div>
    );
};
