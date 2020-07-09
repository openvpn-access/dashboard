import {Button} from '@components/Button';
import {InputField} from '@components/InputField';
import {api, extractAPIError} from '@state/api';
import {session} from '@state/modules/session';
import {APIError} from '@state/types';
import {FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './UpdateCredentials.module.scss';

export const UpdateCredentials: FunctionalComponent = () => {
    const [changePassword, setChangePassword] = useState(false);
    const [newUsername, setUsername] = useState('');
    const [newEmail, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<APIError | null>(null);

    useEffect(() => {
        session.store.watch(state => {
            if (state.user) {
                setUsername(state.user.username);
                setEmail(state.user.email);
            }
        });
    }, []);

    const submit = () => api({
        method: 'PUT', route: '/users/admin', data: {
            email: newEmail,
            username: newUsername,
            currentPassword,
            ...(changePassword && {password: newPassword})
        }
    }).then(() => {
        setChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setError(null);
    }).catch(setError);

    return (
        <div className={styles.updateCredentials}>
            <h3>Update Credentials</h3>

            <div className={styles.form}>
                <InputField value={newUsername}
                            required={true}
                            placeholder="Username"
                            icon="user"
                            error={extractAPIError(error, 1, 3)}
                            onChange={setUsername}
                            ariaLabel="New username"/>

                <InputField value={newEmail}
                            required={true}
                            placeholder="E-Mail"
                            icon="envelope"
                            error={extractAPIError(error, 3)}
                            onChange={setEmail}
                            ariaLabel="New e-mail"/>

                <InputField value={currentPassword}
                            required={true}
                            password={true}
                            placeholder="Password"
                            icon="lock"
                            error={extractAPIError(error, 2)}
                            onChange={setCurrentPassword}
                            ariaLabel="Current password"
                            onSubmit={submit}/>

                {changePassword && <InputField value={newPassword}
                                               required={true}
                                               password={true}
                                               placeholder="New password"
                                               icon="lock"
                                               error={extractAPIError(error, 5)}
                                               onChange={setNewPassword}
                                               ariaLabel="New password"
                                               onSubmit={submit}/>}

                <div className={styles.actionBar}>
                    {!changePassword && <button className={styles.changePasswordBtn}
                                                onClick={() => setChangePassword(true)}
                                                aria-label="Change password too">
                        Change password?
                    </button>}


                    <Button className={styles.submitBtn}
                            text="Submit"
                            disabled={!currentPassword || !newEmail || !newUsername}
                            onClick={submit}/>
                </div>
            </div>
        </div>
    );
};
