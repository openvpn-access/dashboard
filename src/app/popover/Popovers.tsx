/* eslint-disable @typescript-eslint/no-explicit-any */
import {Popper} from '@components/Popper';
import {eventPath} from '@utils/event-path';
import {createNativeEventContainer} from '@utils/events';
import {createRef, FunctionalComponent, h} from 'preact';
import {StateUpdater, useEffect, useState} from 'preact/hooks';
import {JSXInternal} from 'preact/src/jsx';
import styles from './Popovers.module.scss';
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

export const Popovers: FunctionalComponent = () => {
    const [subState] = state = useState<State>(null);
    const container = createRef<Popper>();
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
                const el = container.current?.base as (HTMLElement | undefined);
                if (state?.[0]?.visible && el && !eventPath(e).includes(el)) {
                    hidePopover();
                }
            }]
        ]);

        return () => nativeEvents.unbind();
    });

    if (subState && list.has(subState.name)) {
        const Component = list.get(subState.name) as FunctionalComponent<unknown>;
        content = <Component {...subState.data} hidePopover={hidePopover} ref={container}/>;
    }

    return (
        <div className={styles.popovers} data-visible={subState?.visible}>
            {content}
        </div>
    );
};
