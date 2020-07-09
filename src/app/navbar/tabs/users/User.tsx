import {DBUser} from '@state/types';
import {formatDate} from '@utils/format-date';
import {FunctionalComponent, h} from 'preact';
import styles from './User.module.scss';

type Props = {
    user: DBUser;
};

// TODO: Move date format to settings
const DATE_FORMAT = 'DD.MM.YYYY';
export const User: FunctionalComponent<Props> = ({user}) => (
    <div className={styles.user}>
        <p className={styles.id}>{user.id}</p>

        <div className={styles.type}>
            <bc-icon name={user.type}/>
        </div>

        <div className={styles.state} data-state={user.state}>
            <div/>
        </div>

        <p>{user.username}</p>
        <p>{user.email}</p>
        <p>{formatDate(DATE_FORMAT, user.created_at)}</p>
        <p>{formatDate(DATE_FORMAT, user.updated_at)}</p>
    </div>
);
