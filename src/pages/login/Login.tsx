import {LoadingIndicator} from '@components/LoadingIndicator';
import {Portal} from '@components/Portal';
import {session} from '@state/session';
import {delayPromise} from '@utils/promises';
import {staticStore} from '@utils/static-store';
import {useStore} from 'effector-react';
import {h} from 'preact';
import {route} from 'preact-router';
import {useEffect, useState} from 'preact/hooks';
import {Auth} from './Auth';
import styles from './Login.module.scss';
import {Username} from './Username';

export default () => {
    const [view, setView] = useState<'idle' | 'username' | 'auth'>('idle');

    useEffect(() => {
        const sessionState = useStore(session.store);
        const token = staticStore.getJSON<string>('token');

        if (token && sessionState.token === null) {
            delayPromise(1000, session.login({token}))
                .then(() => {
                    route('/');
                })
                .catch(() => {
                    setView('username');
                    staticStore.delete('token');
                });
        } else {
            setView('username');
        }
    }, []);

    return (
        <div className={styles.login}>
            <svg version="1.1" viewBox="0 0 50 50">
                <path d="M21.3,15c0.4-2-0.8-2.9-0.7-3c0.3,0.2,1.6,0.4,1.7,2.1c0,1.1-0.2,2.3,0.4,3.3C22.7,17.5,20.9,17,21.3,15z"/>
                <path
                    d="M41.4,29L41,28.5c-0.7-1.1-2.4-3.8-2.9-4.7c0.2-0.9-0.2-1.6-0.6-2.1c-1.1-1.2-2.9-2.9-5.5-4.1  c-0.9-2.9-2.9-3.4-4.7-3.8c-1.2-0.3-1.8-0.5-3.1-1.5c-1.3-1-2.8-0.8-3.1-0.8c-0.3,0,1.6,0.4,1.7,2.1s-0.6,3.2,2.3,5.3  c-0.9,0.4-3.3,2-4.4,3c-1,1-3.1,2.3-6.4,3.2c-0.2,0.1-0.4,0.2-0.5,0.4c-0.1,0.2-0.1,0.4,0,0.6c0.2,0.4,0.9,0.8,1.6,1.1  c-1.7,0.7-4.8,1-6.8,1c-0.3,0-0.5,0.2-0.7,0.4C7.8,29,7.9,29.3,8,29.5c1.8,2.2,4.8,3.8,6.4,4.6c-0.5,0.3-1,0.6-1.6,0.8  c-0.3,0.1-0.5,0.3-0.5,0.6c0,0.3,0.1,0.6,0.4,0.7c6.4,3,5.7,3.4,8.9-0.4s5.6-0.9,7.9-2.2c2.2-1.3,5.8-1.6,7.4-0.8  c2,0.9,4.5-0.7,5-1.6C42.3,30.5,42.1,30.1,41.4,29z M32.4,24.6c-0.7-0.6-0.8-1.7-0.2-2.4l2.6,2.2C34.2,25.1,33.1,25.2,32.4,24.6zM38,31.9c0,0,2-0.6,2.3-1.4c0.3-0.8-0.7-2-0.7-2s0.9,0.7,1.5,1.7C41.7,31.3,38,31.9,38,31.9z"/>
            </svg>

            <Portal className={styles.portal}
                    show={view}
                    views={{
                        'idle': (<LoadingIndicator visible={true}/>),
                        'username': (<Username onSubmit={() => setView('auth')}/>),
                        'auth': (<Auth/>)
                    }}/>
        </div>
    );
};
