/* eslint-disable @typescript-eslint/no-explicit-any */
import {createEventContainer} from '@utils/event-container';
import {FunctionalComponent} from 'preact';

export type PopoverInfo = {
    title: string;
    icon?: string;
}

export type Popover<Props> = {
    info: PopoverInfo | ((props: Props) => PopoverInfo);
    component: FunctionalComponent<Props & {
        hidePopover: () => void;
    }>;
}

export type PopoverEvents = {
    show: [string, any];
    register: [string, Popover<any>];
}

export const events = createEventContainer<PopoverEvents>();

