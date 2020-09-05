import {FunctionalComponent, h} from 'preact';
import styles from './PinField.module.scss';

type Falsish = null | false | undefined;

type Props = {
    length: number;
    error?: string | Falsish;
    value?: string;
    disabled?: boolean;
    ariaLabel?: string;
    onSubmit?: (v: string) => void;
    onChange?: (v: string) => void;
}

export const PinField: FunctionalComponent<Props> = props => {
    const digits = [
        ...(props.value === undefined ? '' : props.value)
            .padEnd(props.length, '0')
    ];

    const refs = new Array<HTMLButtonElement>(props.length);
    const keydown = (e: KeyboardEvent) => {
        const {target, key} = e;
        const next = refs.indexOf(target as HTMLButtonElement) + 1;

        if (target && key >= '0' && key <= '9') {

            // Update digit and fire event
            digits[next - 1] = key;
            props.onChange?.(digits.join(''));

            // Focus next field
            if (next && next < props.length) {
                refs[next]?.focus();
            }
        } else if (key === 'Enter') {
            props.onSubmit?.(digits.join(''));
        } else if (key === 'Backspace') {
            digits[next - 1] = '0';
            props.onChange?.(digits.join(''));

            // Focus previous field
            if (next && (next - 2) >= 0) {
                refs[next - 2]?.focus();
            }
        }
    };

    return (
        <div className={styles.pinField}
             aria-label={props.ariaLabel}
             role="textbox">
            <div className={styles.digits}
                 style={`--grid-cols: ${props.length}`}>
                {
                    digits.map((digit, index) => (
                        <button className={styles.digit}
                                disabled={props.disabled}
                                data-errored={!!props.error}
                                key={index}
                                onKeyDown={keydown}
                                type="button"
                                aria-label={`Pin number ${index + 1}`}
                                ref={instance => instance && (refs[index] = instance)}>
                            <span>{digit}</span>
                        </button>
                    ))
                }
            </div>

            {props.error && <p className={styles.errorMessage}>{props.error}</p>}
        </div>
    );
};
