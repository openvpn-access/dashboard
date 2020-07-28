import {ErrorCode} from '@api/enums/ErrorCode';
import {Button} from '@components/form/Button';
import {InputField} from '@components/form/InputField';
import {PinField} from '@components/form/PinField';
import {session} from '@state/session';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {Fragment, FunctionalComponent, h} from 'preact';
import {Link, route} from 'preact-router';
import {useState} from 'preact/hooks';
import styles from './Auth.module.scss';
import {login} from './state';

export const Auth: FunctionalComponent = () => {
    const {login_id, mfa_required} = login.state.getState();
    const [loading, setLoading] = useState(false);
    const form = useForm({
        password: '',
        mfa_code: undefined
    });

    const submit = form.onSubmit(values => {
        setLoading(true);
        form.clearErrors();

        delayPromise(1000, session.login({
            login_id, ...values
        })).then(() => {
            route('/');
            login.state.reset();
            form.clearValues();
        }).catch(err => {
            switch (err.code) {
                case ErrorCode.INVALID_PASSWORD:
                    return form.setError('password', 'Invalid password');
                case ErrorCode.LOCKED_ACCOUNT:
                    return form.setError('password', 'Account is locked. Try again later.');
                case ErrorCode.INVALID_MFA_CODE:
                    return form.setError('mfa_code', 'Invalid code.');
            }
        }).finally(() => setLoading(false));
    });

    return (
        <div className={styles.auth}>
            <InputField placeholder="Password"
                        icon="lock"
                        disabled={loading}
                        type="password"
                        ariaLabel="Password"
                        onSubmit={submit}
                        {...form.register('password')}/>

            {mfa_required && <Fragment>
                <p>Please enter the code from your authenticator:</p>
                <PinField length={6}
                          onSubmit={submit}
                          {...form.register('mfa_code')}/>
            </Fragment>}

            <div className={styles.btnBar}>
                <Link href="/forgot-password">Forgot password?</Link>

                <Button text="Submit"
                        loading={loading}
                        disabled={form.empty()}
                        onClick={submit}/>
            </div>
        </div>
    );
};
