import {api} from '@api/index';
import {DBUser} from '@api/types';
import {Button} from '@components/form/Button';
import {session} from '@state/session';
import {delayPromise} from '@utils/promises';
import {Fragment, FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './InfoBar.module.scss';

export const InfoBar: FunctionalComponent = () => {
    const user = session.store.getState().user as DBUser;
    const [state, setState] = useState<'idle' | 'sending' | 'errored' | 'sended'>('idle');

    const resendVerficiationEmail = () => {
        setState('sending');

        delayPromise(1000, api({
            route: '/users/email/verify/send',
            method: 'POST',
            data: {email: user.email}
        })).then(() => {
            setState('sended');
        }).catch(() => {
            setState('errored');
        });
    };

    return (
        <div className={styles.infoBar}>

            <div className={styles.status}
                 aria-label={user.activated ? 'Info: Account is activated' : 'Info: Account is deactivated.'}
                 data-status={user.activated ? 'ok' : 'error'}>
                {user.activated ?
                    <Fragment>
                        <span>You&apos;re account is activated!</span>
                        <bc-icon name="happy"/>
                    </Fragment> :
                    <Fragment>
                        <span>Your account has been deactivated by an administrator.</span>
                    </Fragment>
                }
            </div>

            {!user.email_verified && <Fragment>
                <div className={styles.status}
                     data-status="error"
                     role="alert">
                    <span>Please verify your email address by clicking the link we&apos;ve send you!</span>
                </div>

                <div className={styles.requestNewVerificationEmail}>
                    {
                        state === 'idle' ? <p>Didn&apos;t get an email? Request a new one!</p> :
                            state === 'sending' ? <p>Sending...</p> :
                                state === 'errored' ? <p>Failed to send email. Please check if your email address is valid.</p> : <p>Check your inbox!</p>
                    }

                    <Button text="Resend"
                            ariaLabel="Request new verification email"
                            loading={state === 'sending'}
                            onClick={resendVerficiationEmail}/>
                </div>
            </Fragment>
            }
        </div>
    );
};
