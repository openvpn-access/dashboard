/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt: any): Array<HTMLElement> {
    let path = evt.path || (evt.composedPath && evt.composedPath());
    if (path) {
        return path;
    }

    let el = evt.target.parentElement;
    path = [evt.target, el];
    while (el = el.parentElement) {
        path.push(el);
    }

    path.push(document, window);
    return path;
}
