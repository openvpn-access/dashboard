import {Popper} from '@components/Popper';
import {cn} from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import styles from './HelpCard.module.scss';

type Props = {
    className?: string;
    label: string;
}

export const HelpCard: FunctionalComponent<Props> = props => (
    <Popper button={open => <bc-icon name="help"
                                     class={styles.btn}
                                     data-active={open}/>}
            content={
                <div className={cn(styles.content, props.className)}>
                    {props.children}
                </div>
            }>
    </Popper>
);
