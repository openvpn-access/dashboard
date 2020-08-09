import {api, ErrorCode} from '@api/index';
import {validation} from '@api/validation';
import {Button} from '@components/form/Button';
import {InputField} from '@components/form/InputField';
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

    const submit = form.onSubmit(() => {
        const data = form.values();
        form.clearErrors();

        if (!changePassword) {
            delete data.password;
        }

        setLoading(true);
        delayPromise(1000, api({
            method: 'PATCH',
            route: `/users/${session.store.getState().user?.id}`,
            data
        })).then(() => {
            form.resetValue('current_password', 'password');
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
    });

    return (
        <form className={styles.updateCredentials}
              aria-label="Update login credentials"
              onSubmit={submit}>
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

                <InputField type="password"
                            placeholder="Password"
                            icon="lock"
                            ariaLabel="Current password"
                            {...form.register('current_password', {
                                required: true
                            })}/>

                {changePassword && <InputField type="password"
                                               passwordMeter={true}
                                               placeholder="New password"
                                               icon="lock"
                                               ariaLabel="New password"
                                               {...form.register('password', {
                                                   validate: validation.user.password
                                               })}/>}

                <div className={styles.actionBar}>
                    {!changePassword && <button className={styles.changePasswordBtn}
                                                onClick={() => setChangePassword(true)}
                                                aria-label="Change password too"
                                                type="button">
                        Change password?
                    </button>}


                    <Button className={styles.submitBtn}
                            text="Submit"
                            loading={loading}
                            submit={true}
                            disabled={form.empty('username', 'email', 'current_password')}/>
                </div>
            </div>
        </form>
    );
};
