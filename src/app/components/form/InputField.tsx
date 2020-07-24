import {cn} from '@utils/preact-utils';
import {createRef, FunctionalComponent, h} from 'preact';
import {JSXInternal} from 'preact/src/jsx';
import styles from './InputField.module.scss';

type Falsish = null | false | undefined;

type Props = {
    ariaLabel?: string;
    className?: string;
    password?: boolean;
    passwordMeter?: boolean;
    icon?: string;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    error?: string | Falsish;
    value?: string;
    onSubmit?: (v: string) => void;
    onChange?: (v: string) => void;
    onClick?: (() => void) | boolean;
    afterInput?: Array<JSXInternal.Element> | JSXInternal.Element
};

const symbols: Array<[RegExp, number]> = [
    [/[0-9]/, 10],
    [/[a-z]/, 26],
    [/[A-Z]/, 26],
    [/[\W]/, 26],
    [/[\x20-\x2F\x3A-\x40\x5B-\x60{|}~]/, 32]
];

const entropy = (pw: string): number => {
    if (!pw.length) {
return 0;
}

    let charSets = 0;
    for (const [regex, en] of symbols) {
        charSets += regex.test(pw) ? en : 0;
    }

    return Math.log2(charSets) * pw.length;
};

export const InputField: FunctionalComponent<Props> = props => {
    const inputField = createRef<HTMLInputElement>();
    const getValue = () => inputField.current?.value || '';

    return (
        <div className={cn(styles.inputField, props.className)}
             onClick={typeof props.onClick === 'function' ? props.onClick : undefined}>

            <div className={cn(styles.main, {
                [styles.buttonLike]: !!props.onClick
            })} data-errored={props.error}>
                {props.icon && <bc-icon name={props.icon}/>}

                <input type={props.password ? 'password' : 'text'}
                       ref={inputField}
                       readOnly={props.readonly || !!props.onClick}
                       placeholder={props.placeholder}
                       aria-label={props.ariaLabel || props.placeholder}
                       value={props.value || ''}
                       onInput={() => props.onChange?.(getValue())}
                       onKeyUp={e => e.key === 'Enter' && props.onSubmit?.(getValue())}
                       disabled={props.disabled}/>

                {
                    props.password && props.passwordMeter &&
                        <div className={styles.passwordQualityMeter}
                             style={`--pwd-entropy: ${Math.min(entropy(props.value || '') / 200, 1)};`}/>
                }

                {props.afterInput}
            </div>

            {props.error && <p className={styles.error}>{props.error}</p>}
        </div>
    );
};
