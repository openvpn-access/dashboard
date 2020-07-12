import {Button} from '@components/Button';
import {InputField} from '@components/InputField';
import {api} from '@state/api';
import {session} from '@state/modules/session';
import {Status} from '@utils/enums/Status';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './UpdateCredentials.module.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
            switch (err.status) {
                case Status.UNAUTHORIZED:
                    return form.setError('current_password', 'Invalid password');
                case Status.FORBIDDEN:
                    return form.setError('username', 'This user cannot change its username');
            }
        }).finally(() => setLoading(false));
    };

    return (
        <div className={styles.updateCredentials}>
            <h3>Update Credentials</h3>

            <div className={styles.form}>
                <InputField required={true}
                            placeholder="Username"
                            icon="user"
                            ariaLabel="New username"
                            {...form.register('username', {
                                validate: [
                                    [v => v.length > 3, 'Must be longer than 3 characters'],
                                    [v => v.length < 50, 'Cannot be longer than 50 characters'],
                                    [v => /^[\w]+$/.exec(v), 'Can only contain alphanumeric characters']
                                ]
                            })}/>

                <InputField required={true}
                            placeholder="E-Mail"
                            icon="envelope"
                            ariaLabel="New e-mail"
                            {...form.register('email', {
                                validate: [
                                    [v => EMAIL_REGEX.exec(v), 'Please enter a valid email-address.']
                                ]
                            })}/>

                <InputField required={true}
                            password={true}
                            placeholder="Password"
                            icon="lock"
                            ariaLabel="Current password"
                            onSubmit={form.onSubmit(submit)}
                            {...form.register('current_password')}/>

                {changePassword && <InputField required={true}
                                               password={true}
                                               placeholder="New password"
                                               icon="lock"
                                               ariaLabel="New password"
                                               onSubmit={form.onSubmit(submit)}
                                               {...form.register('password', {
                                                   validate: [
                                                       [v => v.length > 8, 'Minimum length is 8 characters '],
                                                       [v => v.length < 50, 'Cannot be longer than 50 characters'],
                                                       [v => /^[\S]+$/.exec(v), 'May not contain whitespace']
                                                   ]
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
