import {ErrorPage} from '@lib/async-route/ErrorPage';
import {FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {JSXInternal} from 'preact/src/jsx';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
    getComponent: () => Promise<any>;
    loading?: () => JSXInternal.Element;
};


export const AsyncRoute: FunctionalComponent<Props> = ({getComponent, loading}) => {
    const [component, setComponent] = useState<JSXInternal.Element | null>(loading?.() || null);

    useEffect(() => {
        const loadPage = () => getComponent().then(module => {
            const Component = module.default;
            setComponent(<Component/>);
        }).catch(() => {
            setComponent(<ErrorPage retry={loadPage}/>);
        });

        void loadPage();
    }, [getComponent]);

    return component;
};
