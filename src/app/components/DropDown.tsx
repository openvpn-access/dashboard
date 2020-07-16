/* eslint-disable @typescript-eslint/no-explicit-any */
import {cn} from '@utils/preact-utils';
import {createRef, FunctionalComponent, h} from 'preact';
import styles from './DropDown.module.scss';
import {Popper} from './Popper';

type Props = {
    'aria-label'?: string;
    icon?: string;
    value?: number | string;
    disabled?: boolean;
    items: Array<string> | {[key: string]: string} | Array<[string, string]>;
    onChange: (index: any) => void;
};

export const DropDown: FunctionalComponent<Props> = props => {
    const popper = createRef<Popper>();

    const select = (index: any) => () => {
        popper.current?.toggle();
        props.onChange(index);
    };

    const {items, value} = props;
    const isEntries = Array.isArray(items) && items[0]?.length === 2;

    // Convert input to key-value pairs
    const entries = (isEntries ? items : Object.entries(items)) as Array<[string, string]>;

    // Use first item if not specified
    const selectedItem = value === undefined ? entries[0][0] : value;

    // Currently selected option
    const current = entries.find(v => v[0] === selectedItem);

    if (!current) {
        throw new Error('Failed to resolve currently selected element in dropdown');
    }

    // Available options
    let maxTextWidth = current[1].length;
    const buttons = [];
    for (const [key, value] of entries) {
        if (key !== selectedItem) {
            buttons.push(
                <button key={key}
                        onClick={select(key)}
                        aria-label={value}>
                    {value}
                </button>
            );
        }

        maxTextWidth = Math.max(maxTextWidth, value.length);
    }

    return (
        <Popper ref={popper}
                disabled={props.disabled}
                button={open =>
                    <button className={cn(styles.button, {
                        [styles.open]: open,
                        [styles.empty]: !buttons.length,
                        [styles.disabled]: !!props.disabled
                    })} aria-label={props['aria-label'] || 'Open context menu'}>
                        {props.icon && <bc-icon name={props.icon}/>}

                        <p style={`min-width: calc(${maxTextWidth} * 0.6em)`}>
                            {current[1]}
                        </p>
                    </button>
                }
                content={
                    <section className={styles.items}>
                        {buttons}
                    </section>
                }/>
    );
};
