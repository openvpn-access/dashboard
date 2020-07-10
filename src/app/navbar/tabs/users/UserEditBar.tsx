import {Button} from '@components/Button';
import {DropDown} from '@components/DropDown';
import {InputField} from '@components/InputField';
import {api, extractAPIError} from '@state/api';
import {users} from '@state/modules/users';
import {APIError, DBUser} from '@state/types';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './UserEditBar.module.scss';

type Props = {
    user: DBUser;
    onSave: (v: false) => void;
};

export const UserEditBar: FunctionalComponent<Props> = ({user, onSave}) => {
    const [newUsername, setUsername] = useState(user.username);
    const [newEmail, setEmail] = useState(user.email);
    const [newType, setType] = useState(user.type);
    const [error, setError] = useState<APIError | null>(null);
    const [loading, setLoading] = useState(false);

    const save = () => {
        setLoading(true);

        api({
            method: 'PUT', route: `/users/${user.username}`, data: {
                email: newEmail,
                username: newUsername,
                type: newType
            }
        }).then(() => {
            void users.updateView();
            setLoading(false);
            setError(null);
            onSave(false);
        }).catch(err => {
            setError(err);
            setLoading(false);
        });
    };

    return (
        <div className={styles.userEditBar}>
            <DropDown items={{
                admin: 'Admin',
                user: 'User'
            }} selected={newType}
                      icon={newType}
                      onSelect={setType}/>

            <InputField value={newUsername}
                        placeholder="Username"
                        ariaLabel="Update this users username"
                        icon="user"
                        disabled={loading}
                        error={extractAPIError(error, 'username')}
                        onChange={setUsername}/>

            <InputField value={newEmail}
                        placeholder="E-Mail"
                        ariaLabel="Update this users email"
                        icon="envelope"
                        disabled={loading}
                        error={extractAPIError(error, 'email')}
                        onChange={setEmail}/>

            <Button text="Save"
                    icon="save"
                    loading={loading}
                    onClick={save}/>
        </div>
    );
};
