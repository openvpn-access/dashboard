/* eslint-disable @typescript-eslint/no-explicit-any */
import {FunctionalComponent, h} from 'preact';
import {StateUpdater, useState} from 'preact/hooks';
import {JSXInternal} from 'preact/src/jsx';
import styles from './Popover.module.scss';
import {UserEditor} from './UserEditor';

export type PopoverBaseProps<T> = T & {
    hidePopover: () => void;
};

type State = {
    visible: boolean;
    data: any;
    name: string;
} | null;

let state: [State, StateUpdater<State>] | null = null;

const list = new Map<string, FunctionalComponent<PopoverBaseProps<any>>>([
    ['UserEditor', UserEditor]
]);

const hidePopover = () => state && state[1]({...state[0], visible: false} as State);

export const showPopover = (name: string, data: unknown) => {
    state?.[1]({name, data, visible: true});
};

export const Popover: FunctionalComponent = () => {
    const [subState] = state = useState<State>(null);
    let content: JSXInternal.Element | null = null;

    if (subState && list.has(subState.name)) {
        const Component = list.get(subState.name) as FunctionalComponent<unknown>;
        content = <div className={styles.container}>
            <button aria-label="Close popover"
                    onClick={hidePopover}>
                <bc-icon name="delete"/>
            </button>
            <Component {...subState.data} hidePopover={hidePopover}/>
        </div>;
    }

    return (
        <div className={styles.popover} data-visible={subState?.visible}>
            {content}
        </div>
    );
};
