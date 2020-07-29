import {DBUser} from '@api/types';
import {showPopover} from '@lib/popover';
import {formatDate} from '@utils/format-date';
import {FunctionalComponent, h} from 'preact';
import styles from './User.module.scss';

type Props = {
    user: DBUser;
};

// TODO: Move date format to settings
const DATE_FORMAT = 'DD.MM.YYYY';
export const User: FunctionalComponent<Props> = ({user}) => (
    <div className={styles.container}
         role="row">
        <div className={styles.user}>
            <p className={styles.id} role="cell">{user.id}</p>

            <div className={styles.type} role="cell">
                <bc-icon name={user.type}/>
            </div>

            <div className={styles.state}
                 data-activated={user.activated}
                 aria-label={`User with username ${user.username} is ${user.activated ? 'activated' : 'deactivated'}`}
                 role="cell">
                <div/>
            </div>

            <p className={styles.username} role="cell">
                <span>{user.username}</span>
                {user.email_verified && <bc-icon name="verified-account"/>}
            </p>

            <p role="cell">{user.email}</p>
            <p role="cell">{formatDate(DATE_FORMAT, user.created_at)}</p>
            <p role="cell">{formatDate(DATE_FORMAT, user.updated_at)}</p>

            <button className={styles.edit}
                    aria-label={`Edit user ${user.id} with username ${user.username}`}
                    onClick={() => showPopover('user-editor', {user})}>
                <bc-icon name="edit"/>
            </button>
        </div>
    </div>
);
