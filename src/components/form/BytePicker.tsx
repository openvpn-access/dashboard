import {isDigitalStorageString, parseDigitalStorageString} from '@utils/parse-digital-storage-string';
import {FunctionalComponent, h} from 'preact';
import {useRef} from 'preact/hooks';
import prettyBytes from 'pretty-bytes';
import styles from './BytePicker.module.scss';

type Props = {
    value: string | number | null | undefined;
    nullable?: boolean;
    placeholder?: string;
    onChange: (v: number | null) => void;
}

export const BytePicker: FunctionalComponent<Props> = props => {
    const input = useRef<HTMLInputElement>();
    let value = typeof props.value === 'number' ? prettyBytes(props.value) : props.value || '';

    const consume = () => {
        if (input.current) {
            const el = input.current;
            if (isDigitalStorageString(el.value)) {
                value = el.value;
            } else {
                el.value = value;
            }
        }
    };

    const clear = () => {
        props.onChange(null);
    };

    const blur = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            input.current?.blur();
        }
    };

    const parse = () => {
        const numVal = parseDigitalStorageString(value);
        props.onChange(numVal);
    };

    return (
        <div className={styles.bytePicker}>
            <bc-icon name="network-drive"/>

            <input type="text"
                   arial-label="Byte amount"
                   onBlur={parse}
                   onInput={consume}
                   onKeyUp={blur}
                   ref={input}
                   value={props.value === null || props.value === undefined ? '∞' : value}/>

            {props.nullable && <button onClick={clear}>
                <bc-tooltip content="No limit"/>
                <bc-icon name="infinite"/>
            </button>}
        </div>
    );
};
