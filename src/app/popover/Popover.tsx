import {IconButton} from '@components/form/IconButton';
import {PopoverBaseProps} from '@popover';
import {cn} from '@utils/preact-utils';
import {uid} from '@utils/uid';
import {FunctionalComponent, h} from 'preact';
import styles from './Popover.module.scss';

type Props = {
    title: string;
    icon?: string;
    className?: string;
    description?: string;
};

export const Popover: FunctionalComponent<PopoverBaseProps<Props>> = props => {
    const labelledById = uid('aria');

    return (
        <div className={styles.popover}
             role="dialog"
             aria-labelledby={labelledById}>

            <div className={styles.title}>
                {props.icon && <bc-icon name={props.icon}/>}
                <h3 id={labelledById}>{props.title}</h3>
                <IconButton icon="delete"
                            ariaLabel="Close dialog"
                            onClick={props.hidePopover}/>
            </div>

            <div className={cn(styles.content, props.className)}>
                {props.children}
            </div>
        </div>
    );
};
