import {Button} from '@components/Button';
import {InputField} from '@components/InputField';
import {api, APIError} from '@state/api';
import {sessionStore} from '@state/session';
import {FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './UpdateCredentials.module.scss';

export const UpdateCredentials: FunctionalComponent = () => {
    const [changePassword, setChangePassword] = useState(false);
    const [newUsername, setUsername] = useState('');
    const [newEmail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState<APIError | null>(null);

    useEffect(() => {
        sessionStore.watch(state => {
            if (state.user) {
                setUsername(state.user.username);
                setEmail(state.user.email);
            }
        });
    }, []);

    const submit = () => api('PUT', '/user/admin', {
        email: newEmail,
        username: newUsername,
        currentPassword: password,
        ...(changePassword && {password: newPassword})
    }).then(() => {
        setPassword('');
        setNewPassword('');
    }).catch(setError);

    return (
        <div className={styles.updateCredentials}>
            <h3>Update Credentials</h3>

            <div className={styles.form}>
                <InputField value={newUsername}
                            required={true}
                            placeholder="Username"
                            icon="user"
                            error={error?.id === 1 && error.message}
                            onChange={setUsername}
                            ariaLabel="New username"/>

                <InputField value={newEmail}
                            required={true}
                            placeholder="E-Mail"
                            icon="envelope"
                            onChange={setEmail}
                            ariaLabel="New e-mail"/>

                <InputField value={password}
                            required={true}
                            placeholder="Password"
                            icon="lock"
                            error={error?.id === 2 && error.message}
                            onChange={setPassword}
                            ariaLabel="Current password"
                            onSubmit={submit}/>

                {changePassword && <InputField value={newPassword}
                                               required={true}
                                               placeholder="New password"
                                               icon="lock"
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
                            disabled={!password || !newEmail || !newUsername}
                            onClick={submit}/>
                </div>
            </div>
        </div>
    );
};
