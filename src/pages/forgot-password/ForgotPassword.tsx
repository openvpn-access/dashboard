import {api} from '@api/index';
import {validation} from '@api/validation';
import {Button} from '@components/form/Button';
import {InputField} from '@components/form/InputField';
import {Portal} from '@components/Portal';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {Fragment, h} from 'preact';
import {Link} from 'preact-router';
import {useState} from 'preact/hooks';
import styles from './ForgotPassword.module.scss';

export default () => {
    const [view, setView] = useState<'idle' | 'send'>('idle');
    const [loading, setLoading] = useState(false);
    const form = useForm({email: ''});

    const submit = form.onSubmit(values => {
        setLoading(true);

        delayPromise(1000, api({
            method: 'POST',
            route: '/users/password/reset/send',
            data: values
        })).finally(() => {
            setLoading(false);
            setView('send');
        });
    });

    return (
        <Portal className={styles.forgotPassword}
                show={view}
                views={{
                    'idle': (
                        <form aria-label="Reset password"
                              onSubmit={submit}>
                            <h3>Enter your user accounts verified email address and we will send you a password reset link.</h3>

                            <InputField placeholder="Email Address"
                                        icon="envelope"
                                        disabled={loading}
                                        {...form.register('email', {
                                            validate: validation.user.email
                                        })}/>

                            <div className={styles.btnBar}>
                                <Link href="/login" aria-label="Go back to login page">Back to login</Link>

                                <Button text="Submit"
                                        loading={loading}
                                        submit={true}
                                        disabled={form.empty()}/>
                            </div>
                        </form>
                    ),
                    'send': (
                        <Fragment>
                            <div className={styles.verified}>
                                <div className={styles.msg}>
                                    <bc-icon name="checkmark"/>
                                    <span>If this email belogs to a verified and valid account please check your inbox.</span>
                                </div>
                                <Link href="/login" aria-label="Go back to login page">Back to login</Link>
                            </div>
                        </Fragment>
                    )
                }}/>
    );
};
