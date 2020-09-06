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
    const [useBackupCode, setUseBackupCode] = useState(false);
    const form = useForm({
        password: '',
        mfa_code: undefined,
        backup_code: undefined
    });

    const submit = form.onSubmit(values => {
        setLoading(true);
        form.clearErrors();

        delayPromise(1000, session.login({
            login_id, ...values
        })).then(() => {
            route('/');
            login.state.reset();
            form.resetValues();
        }).catch(err => {
            switch (err.code) {
                case ErrorCode.INVALID_PASSWORD:
                    return form.setError('password', 'Invalid password');
                case ErrorCode.LOCKED_ACCOUNT:
                    return form.setError('password', 'Account is locked. Try again later.');
                case ErrorCode.INVALID_MFA_CODE:
                    return form.setError('mfa_code', 'Invalid code.');
                case ErrorCode.INVALID_BACKUP_CODE:
                    return form.setError('backup_code', 'Invalid backup code.');
            }
        }).finally(() => setLoading(false));
    });

    return (
        <form className={styles.auth} onSubmit={submit}>
            <InputField placeholder="Password"
                        icon="lock"
                        disabled={loading}
                        type="password"
                        ariaLabel="Your password"
                        autoFocus={true}
                        {...form.register('password')}/>

            {mfa_required && <Fragment>
                {useBackupCode ? <Fragment>
                    <p>Please enter one of your 8-digit backup codes:</p>
                    <InputField type="number"
                                ariaLabel="Your backup code"
                                icon="lock"
                                {...form.register('backup_code')}/>
                </Fragment> : <Fragment>
                    <p>Please enter the code from your authenticator:</p>
                    <PinField length={6} {...form.register('mfa_code')}/>
                </Fragment>
                }


                {useBackupCode ?
                    <span onClick={() => setUseBackupCode(false)} className={styles.linkButton}>Use MFA code instead.</span> :
                    <p>
                        In case you don&apos;t have access to your MFA device anymore you can
                        <span onClick={() => setUseBackupCode(true)} className={styles.linkButton}>deactivate MFA</span>
                        and login using one of your 8-digit backup codes.
                    </p>
                }
            </Fragment>}

            <div className={styles.btnBar}>
                <Link href="/forgot-password" aria-label="Forgot password">Forgot password?</Link>

                <Button text="Submit"
                        ariaLabel="Submit login credentials"
                        submit={true}
                        loading={loading}
                        disabled={!form.getValue('password') && (!form.getValue('mfa_code') || !form.getValue('backup_code'))}/>
            </div>
        </form>
    );
};
