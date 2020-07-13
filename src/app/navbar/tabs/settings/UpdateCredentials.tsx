import {api, ErrorCode} from '@api/index';
import {validation} from '@api/validation';
import {Button} from '@components/Button';
import {InputField} from '@components/InputField';
import {session} from '@state/session';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './UpdateCredentials.module.scss';

export const UpdateCredentials: FunctionalComponent = () => {
    const [loading, setLoading] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const form = useForm({
        username: '',
        email: '',
        current_password: '',
        password: ''
    });

    useEffect(() => {
        session.store.watch(state => {
            if (state.user) {
                form.setValues({
                    username: state.user.username,
                    email: state.user.email
                });
            }
        });
    }, []);

    const submit = () => {
        const data = form.values();
        form.clearErrors();

        if (!changePassword) {
            delete data.password;
        }

        setLoading(true);
        delayPromise(1000, api({
            method: 'PATCH',
            route: '/users/admin',
            data
        })).then(() => {
            form.clearValue('current_password', 'password');
            setChangePassword(false);
        }).catch(err => {
            switch (err.code) {
                case ErrorCode.INVALID_PASSWORD:
                    return form.setError('current_password', 'Invalid password');
                case ErrorCode.LOCKED_USERNAME:
                    return form.setError('username', 'This user cannot change its username');
                case ErrorCode.DUPLICATE_EMAIL:
                    return form.setError('email', 'This email is already in use.');
                case ErrorCode.DUPLICATE_USERNAME:
                    return form.setError('username', 'This username is already in use.');
            }
        }).finally(() => setLoading(false));
    };

    return (
        <div className={styles.updateCredentials}>
            <h3>Update Credentials</h3>

            <div className={styles.form}>
                <InputField placeholder="Username"
                            icon="user"
                            ariaLabel="New username"
                            {...form.register('username', {
                                required: true,
                                validate: validation.user.username
                            })}/>

                <InputField placeholder="E-Mail"
                            icon="envelope"
                            ariaLabel="New e-mail"
                            {...form.register('email', {
                                required: true,
                                validate: validation.user.email
                            })}/>

                <InputField password={true}
                            placeholder="Password"
                            icon="lock"
                            ariaLabel="Current password"
                            onSubmit={form.onSubmit(submit)}
                            {...form.register('current_password', {
                                required: true
                            })}/>

                {changePassword && <InputField password={true}
                                               placeholder="New password"
                                               icon="lock"
                                               ariaLabel="New password"
                                               onSubmit={form.onSubmit(submit)}
                                               {...form.register('password', {
                                                   validate: validation.user.password
                                               })}/>}

                <div className={styles.actionBar}>
                    {!changePassword && <button className={styles.changePasswordBtn}
                                                onClick={() => setChangePassword(true)}
                                                aria-label="Change password too">
                        Change password?
                    </button>}


                    <Button className={styles.submitBtn}
                            text="Submit"
                            loading={loading}
                            disabled={form.empty('username', 'email', 'current_password')}
                            onClick={form.onSubmit(submit)}/>
                </div>
            </div>
        </div>
    );
};
