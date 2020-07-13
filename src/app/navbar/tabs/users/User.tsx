import {DBUser} from '@api/types';
import {formatDate} from '@utils/format-date';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './User.module.scss';
import {UserEditBar} from './UserEditBar';

type Props = {
    user: DBUser;
};

// TODO: Move date format to settings
const DATE_FORMAT = 'DD.MM.YYYY';
export const User: FunctionalComponent<Props> = ({user}) => {
    const [edit, setEdit] = useState(false);

    return (
        <div className={styles.container}>
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

                <button className={styles.edit}
                        aria-label="Edit user"
                        onClick={() => setEdit(true)}>
                    <bc-icon name="edit"/>
                </button>
            </div>

            {edit && <UserEditBar user={user} onSave={setEdit}/>}
        </div>
    );
};
