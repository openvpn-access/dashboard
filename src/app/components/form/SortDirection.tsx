import {FunctionalComponent, h} from 'preact';
import styles from './SortDirection.module.scss';

type SortDir = 'asc' | 'desc';

type Props = {
    ariaLabel?: string;
    disabled?: boolean;
    value: SortDir;
    onChange: (v: SortDir) => void;
};

export const SortDirection: FunctionalComponent<Props> = props => (
    <button className={styles.sortDirection}
            data-disabled={props.disabled}
            data-dir={props.value}
            onClick={() => props.onChange(props.value === 'asc' ? 'desc' : 'asc')}/>
);
