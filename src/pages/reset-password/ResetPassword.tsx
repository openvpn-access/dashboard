import {api} from '@api/index';
import {validation} from '@api/validation';
import {Button} from '@components/form/Button';
import {InputField} from '@components/form/InputField';
import {Portal} from '@components/Portal';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {Fragment, FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './ResetPassword.module.scss';

type State = 'idle' | 'errored' | 'success';

export const ResetPassword: FunctionalComponent = () => {
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<State>('idle');
    const params = new URLSearchParams(location.search);
    const form = useForm({
        newPassword: '',
        newPasswordRepeat: ''
    });

    // Check if url is invalid
    if (!params.get('user') || !params.get('token')) {
        location.href = '/';
    }

    const submit = form.onSubmit(({newPassword, newPasswordRepeat}) => {
        if (newPasswordRepeat !== newPassword) {
            return form.setError('newPasswordRepeat', 'Passwords are not equal');
        }

        setLoading(true);
        delayPromise(1000, api({
            method: 'POST',
            route: '/users/password/reset',
            data: {
                new_password: newPassword,
                token: params.get('token')
            }
        })).then(() => {
            setView('success');
        }).catch(() => {
            setView('errored');
        }).finally(() => {
            setLoading(false);
        });
    });

    return (
        <Portal className={styles.resetPassword}
                show={view}
                views={{
                    'idle': (
                        <div className={styles.form}>
                            <h3>Set a new password:</h3>

                            <InputField placeholder="New password"
                                        disabled={loading}
                                        password={true}
                                        passwordMeter={true}
                                        icon="lock"
                                        {...form.register('newPassword', {
                                            validate: validation.user.password
                                        })}/>

                            <InputField placeholder="Repeat password"
                                        disabled={loading}
                                        password={true}
                                        onSubmit={submit}
                                        icon="lock"
                                        {...form.register('newPasswordRepeat')}/>

                            <Button text="Update"
                                    loading={loading}
                                    onClick={submit}/>
                        </div>
                    ),
                    'errored': (
                        <Fragment>
                            <div className={styles.errored}>
                                <div className={styles.msg}>
                                    <p>An error occured.</p>
                                    <small>Try requesting a new Email to reset your password.</small>
                                </div>
                                <a href="/">Back to login</a>
                            </div>
                        </Fragment>
                    ),
                    'success': (
                        <Fragment>
                            <div className={styles.verified}>
                                <div className={styles.msg}>
                                    <bc-icon name="checkmark"/>
                                    <span>Password successfully changed!</span>
                                </div>
                                <a href="/">Back to login</a>
                            </div>
                        </Fragment>
                    )
                }}/>
    );
};
