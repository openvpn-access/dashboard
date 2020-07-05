/* eslint-disable @typescript-eslint/no-explicit-any */
type Method = 'addEventListener' | 'removeEventListener';
type AnyFunction = (...args: Array<any>) => any;
type AnyObject = Record<string | number | symbol, any>;

export type EventBindingArgs = [
    EventTarget | Array<EventTarget>,
    string | Array<string>,
    AnyFunction,
    AnyObject?
];

interface EventBinding {
    (
        elements: EventTarget | Array<EventTarget>,
        events: string | Array<string>,
        fn: AnyFunction, options?: AnyObject
    ): EventBindingArgs;
}

/* eslint-disable prefer-rest-params */
function eventListener(method: Method): EventBinding {
    return (
        items: EventTarget | Array<EventTarget>,
        events: string | Array<string>,
        fn: AnyFunction, options = {}
    ): EventBindingArgs => {

        // Normalize array
        if (items instanceof HTMLCollection || items instanceof NodeList) {
            items = Array.from(items);
        } else if (!Array.isArray(items)) {
            items = [items];
        }

        if (!Array.isArray(events)) {
            events = [events];
        }

        for (const el of items) {
            for (const ev of events) {
                el[method](ev, fn as EventListener, {capture: false, ...options});
            }
        }

        return [items, events, fn, options];
    };
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener('addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener('removeEventListener');
