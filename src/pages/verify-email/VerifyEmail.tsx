import {api} from '@api/index';
import {Button} from '@components/form/Button';
import {Portal} from '@components/Portal';
import {delayPromise} from '@utils/promises';
import {Fragment, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './VerifyEmail.module.scss';

type State = 'idle' | 'errored' | 'success';

export default () => {
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<State>('idle');
    const params = new URLSearchParams(location.search);

    // Check if url is invalid
    if (!params.get('email') || !params.get('token')) {
        location.href = '/';
    }

    const verify = () => {
        setLoading(true);

        delayPromise(1000, api({
            method: 'POST',
            route: '/users/email/verify',
            data: {token: params.get('token')}
        })).then(() => {
            setView('success');
        }).catch(() => {
            setView('errored');
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Portal className={styles.verifyEmail}
                show={view}
                views={{
                    'idle': (
                        <Fragment>
                            <h1>Verify {params.get('email')}</h1>
                            <Button text="Verify E-Mail!"
                                    loading={loading}
                                    onClick={verify}/>
                        </Fragment>
                    ),
                    'errored': (
                        <Fragment>
                            <div className={styles.errored}>
                                <div className={styles.msg}>
                                    <p>An error occured. Please try again later.</p>
                                    <small>Maybe the verification-token expired. Try logging in and request a new token in this case.</small>
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
                                    <span>E-Mail successfully verified!</span>
                                </div>
                                <a href="/">Back to login</a>
                            </div>
                        </Fragment>
                    )
                }}/>
    );
};
