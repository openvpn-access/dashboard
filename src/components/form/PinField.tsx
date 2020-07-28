import {FunctionalComponent, h} from 'preact';
import styles from './PinField.module.scss';

type Falsish = null | false | undefined;

type Props = {
    length: number;
    error?: string | Falsish;
    value?: string;
    disabled?: boolean;
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

        if (target && key >= '0' && key <= '9') {
            const next = refs.indexOf(target as HTMLButtonElement) + 1;

            // Update digit and fire event
            digits[next - 1] = key;
            props.onChange?.(digits.join(''));

            // Focus next field
            if (next && next < props.length) {
                refs[next]?.focus();
            }
        } else if (key === 'Enter') {
            props.onSubmit?.(digits.join(''));
        }
    };

    return (
        <div className={styles.pinField}>
            <div className={styles.digits}
                 style={`--grid-cols: ${props.length}`}>
                {
                    digits.map((digit, index) => (
                        <button className={styles.digit}
                                disabled={props.disabled}
                                data-errored={!!props.error}
                                key={index}
                                onKeyDown={keydown}
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
