import {FunctionalComponent, h} from 'preact';
import styles from './LoadingIndicator.module.scss';

type Props = {
    visible: boolean;
};

export const LoadingIndicator: FunctionalComponent<Props> = ({visible}) => (
    <div className={styles.loadingIndicator}
         data-visible={visible}>
        <div/>
        <div/>
        <div/>
    </div>
);
