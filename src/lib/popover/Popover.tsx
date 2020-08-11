/* eslint-disable @typescript-eslint/no-explicit-any */
import {IconButton} from '@components/form/IconButton';
import {eventPath} from '@utils/event-path';
import {createNativeEventContainer} from '@utils/events';
import {cn} from '@utils/preact-utils';
import {uid} from '@utils/uid';
import {createRef, FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {JSXInternal} from 'preact/src/jsx';
import {events, Popover} from './events';
import styles from './Popover.module.scss';

/**
 * Registers a new popover
 * @param name A unique name, used to show the popover later
 * @param popover The popover-object itself
 */
export const registerPopover = <Props extends any>(name: string, popover: Popover<Props>) => {
    events.emit('register', name, popover);
};

/**
 * Shows a popover
 * @param name Name of popover
 * @param props Popover props
 */
export const showPopover = (name: string, props?: unknown) => {
    events.emit('show', name, props);
};

const popovers = new Map();
events.on('register', popovers.set.bind(popovers));

/**
 * This popover-container acts as a event-drive container for popovers-.
 */
export const PopoverContainer: FunctionalComponent<{className?: string}> = props => {
    const [visible, setVisible] = useState(false);
    const [popover, setPopover] = useState<[Popover<unknown>, unknown] | null>(null);
    const container = createRef<HTMLDivElement>();

    const hidePopover = () => setVisible(false);
    const showPopover = (name: string, props?: unknown) => {
        if (!popovers.has(name)) {
            throw new Error(`No such popover: ${name}`);
        }

        setVisible(true);
        setPopover([popovers.get(name), props]);
    };

    useEffect(() => {

        // Listen for incoming requests
        events.on('show', showPopover);

        // Close popover if the user presses the escape key or clicks behind the popover
        const eventContainer = createNativeEventContainer();
        eventContainer.onMany([
            [window, 'keydown', (e: KeyboardEvent) => {
                if (visible && e.key === 'Escape') {
                    hidePopover();
                }
            }],
            [window, 'click', (e: MouseEvent) => {
                const el = container.current;
                if (visible && el && !eventPath(e).includes(el)) {
                    hidePopover();
                }
            }]
        ]);

        return () => {
            events.off('show', showPopover);
            eventContainer.unbind();
        };
    });

    let content: JSXInternal.Element | undefined;
    if (popover) {
        const [{component: Component, info}, props] = popover;

        // Evaluate popover-properties
        const {icon, title} = typeof info === 'function' ? info(props) : info;

        const labelledById = uid('aria');
        content = (
            <div role="dialog"
                 className={styles.popover}
                 aria-labelledby={labelledById}>

                <div className={styles.title}>
                    {icon && <bc-icon name={icon}/>}
                    <h3 id={labelledById}>{title}</h3>

                    <IconButton icon="delete"
                                ariaLabel="Close dialog"
                                onClick={hidePopover}/>
                </div>

                <div className={styles.content} ref={container}>
                    <Component hidePopover={hidePopover} {...props} key={Math.random()}/>
                </div>
            </div>
        );
    }

    return (
        <div className={cn(styles.popoverContainer, props.className)}
             data-visible={visible}>
            {content}
        </div>
    );
};
