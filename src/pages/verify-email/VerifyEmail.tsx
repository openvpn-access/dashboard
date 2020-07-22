import {api} from '@api/index';
import {Button} from '@components/form/Button';
import {delayPromise} from '@utils/promises';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './VerifyEmail.module.scss';

type State = 'idle' | 'loading' | 'errored' | 'success';

export const VerifyEmail: FunctionalComponent = () => {
    const [state, setState] = useState<State>('idle');
    const params = new URLSearchParams(location.search);

    const verify = () => {
        setState('loading');

        delayPromise(1000, api({
            method: 'POST',
            route: '/users/email/verify',
            data: {token: params.get('token')}
        })).then(() => {
            setState('success');
        }).catch(() => {
            setState('errored');
        });
    };

    return (
        <div className={styles.verifyEmail}>
            <h1>Verify {params.get('email')}</h1>

            {state === 'errored' && <p className={styles.error}>An error occured. Please try again later.</p>}

            {state === 'success' && <div className={styles.verified}>
                <p className={styles.success}>E-Mail successfully verified!</p>
                <Button text="Take me back"
                        onClick={() => window.open('/', '_self')}/>
            </div>}

            {
                ['idle', 'loading'].includes(state) &&
                    <Button text="Verify E-Mail!"
                            loading={state === 'loading'}
                            onClick={verify}/>
            }
        </div>
    );
};
