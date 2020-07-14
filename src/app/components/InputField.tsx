import {cn} from '@utils/preact-utils';
import {createRef, FunctionalComponent, h} from 'preact';
import styles from './InputField.module.scss';

type Falsish = null | false | undefined;

type Props = {
    ariaLabel?: string;
    className?: string;
    password?: boolean;
    icon?: string;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    error?: string | Falsish;
    value: string;
    onSubmit?: (v: string) => void;
    onChange?: (v: string) => void;
};

export const InputField: FunctionalComponent<Props> = props => {
    const inputField = createRef<HTMLInputElement>();
    const getValue = () => inputField.current?.value || '';

    return (
        <div className={cn(styles.inputField, props.className)}>
            <div className={styles.main}
                 data-errored={props.error}>
                {props.icon && <bc-icon name={props.icon}/>}

                <input type={props.password ? 'password' : 'text'}
                       ref={inputField}
                       readOnly={props.readonly}
                       placeholder={props.placeholder}
                       aria-label={props.ariaLabel}
                       value={props.value}
                       onInput={() => props.onChange?.(getValue())}
                       onKeyUp={e => e.key === 'Enter' && props.onSubmit?.(getValue())}
                       disabled={props.disabled}/>
            </div>

            {props.error && <p className={styles.error}>{props.error}</p>}
        </div>
    );
};
