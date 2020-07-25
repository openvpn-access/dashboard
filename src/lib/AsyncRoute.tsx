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

        // TODO: What if the route cannot be loaded?
        void getComponent().then(module => {
            const Component = module.default;
            setComponent(<Component/>);
        });
    }, []);

    return component;
};
