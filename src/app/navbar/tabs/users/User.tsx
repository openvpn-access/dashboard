import {DBUser} from '@api/types';
import {formatDate} from '@utils/format-date';
import {FunctionalComponent, h} from 'preact';
import {showPopover} from '@popover';
import styles from './User.module.scss';

type Props = {
    user: DBUser;
};

// TODO: Move date format to settings
const DATE_FORMAT = 'DD.MM.YYYY';
export const User: FunctionalComponent<Props> = ({user}) => (
    <div className={styles.container}>
        <div className={styles.user}>
            <p className={styles.id}>{user.id}</p>

            <div className={styles.type}>
                <bc-icon name={user.type}/>
            </div>

            <div className={styles.state} data-activated={user.activated}>
                <div/>
            </div>

            <p className={styles.username}>
                <span>{user.username}</span>
                {user.email_verified && <bc-icon name="verified-account"/>}
            </p>

            <p>{user.email}</p>
            <p>{formatDate(DATE_FORMAT, user.created_at)}</p>
            <p>{formatDate(DATE_FORMAT, user.updated_at)}</p>

            <button className={styles.edit}
                    aria-label="Edit user"
                    onClick={() => showPopover('UserEditor', {user})}>
                <bc-icon name="edit"/>
            </button>
        </div>
    </div>
);
