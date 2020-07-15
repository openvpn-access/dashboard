/* eslint-disable @typescript-eslint/no-explicit-any */
import {eventPath} from '@utils/event-path';
import {createNativeEventContainer} from '@utils/events';
import {createRef, FunctionalComponent, h} from 'preact';
import {StateUpdater, useEffect, useState} from 'preact/hooks';
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

const hidePopover = () => {
    if (state) {
        const [value, setState] = state;
        setState({...value, visible: false} as State);

        // Invalidate data after animation is done
        setTimeout(() => setState(null), 300);
    }
};

export const showPopover = (name: string, data: unknown) => {
    state?.[1]({name, data, visible: true});
};

export const Popover: FunctionalComponent = () => {
    const [subState] = state = useState<State>(null);
    const container = createRef<HTMLDivElement>();
    const nativeEvents = createNativeEventContainer();
    let content: JSXInternal.Element | null = null;

    // Hide popover if user presses the escape key
    useEffect(() => {
        nativeEvents.onMany([
            [window, 'keydown', (e: KeyboardEvent) => {
                if (state?.[0]?.visible && e.key === 'Escape') {
                    hidePopover();
                }
            }],
            [window, 'click', (e: MouseEvent) => {
                if (state?.[0]?.visible && container.current && !eventPath(e).includes(container.current)) {
                    hidePopover();
                }
            }]
        ]);

        return () => nativeEvents.unbind();
    });

    if (subState && list.has(subState.name)) {
        const Component = list.get(subState.name) as FunctionalComponent<unknown>;
        content = <div className={styles.container} ref={container}>
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
