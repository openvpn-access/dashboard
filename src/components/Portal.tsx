import {cn} from '@utils/preact-utils';
import {Fragment, h} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import {JSXInternal} from 'preact/src/jsx';
import styles from './Portal.module.scss';

type Props<T> = {
    className?: string;
    keepAlive?: boolean;
    show: keyof T;
    views: T;
}

export const Portal = <T extends Record<string, JSXInternal.Element>>(props: Props<T>) => {
    const [fadeout, setFadeout] = useState(false);
    const [activeView, setActiveView] = useState(props.show);
    const mounted = useRef(); // See https://stackoverflow.com/a/53406363
    let timeout: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            setFadeout(true);

            timeout && clearTimeout(timeout);
            timeout = setTimeout(() => {
                setActiveView(props.show);
                setFadeout(false);
            }, 300);
        }
    }, [props.show]);

    if (props.keepAlive) {
        return <Fragment>{
            Object.entries(props.views).map(([name, com]) => (
                <div className={cn(styles.portal, props.className)}
                     data-fadeout={fadeout}
                     data-hidden={name !== activeView}
                     key={name}>
                    {com}
                </div>
            ))
        }</Fragment>;
    }

    return (
        <div className={cn(styles.portal, props.className)}
             data-fadeout={fadeout}>
            {props.views[activeView]}
        </div>
    );
};
