import {Button} from '@components/Button';
import {InputField} from '@components/InputField';
import {APIError} from '@state/api';
import {sessionStore, session} from '@state/session';
import {staticStore} from '@utils/static-store';
import {cn} from '@utils/preact-utils';
import {delayPromise} from '@utils/promises';
import {useStore} from 'effector-react';
import {h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './Login.module.scss';

type State = {
    loading: boolean;
    password: string;
    id: string;
    error: APIError | null;
}

export const Login = () => {
    const sessionState = useStore(sessionStore);
    const [state, setState] = useState<State>({
        loading: false,
        password: '',
        id: '',
        error: null
    });

    const setId = (id: string) => setState({...state, id});
    const setPassword = (password: string) => setState({...state, password});

    const login = () => {
        setState({
            ...state,
            loading: true,
            error: null
        });

        delayPromise(1000, session.login({id: state.id, password: state.password}))
            .then(() => setState({
                ...state,
                loading: false,
                id: '',
                password: '',
                error: null
            }))
            .catch(msg => setState({
                ...state,
                loading: false,
                error: msg
            }));
    };

    useEffect(() => {
        const token = staticStore.getJSON<string>('token');

        if (token && sessionState.token === null) {
            setState({
                ...state,
                loading: true,
                id: 'hidden',
                password: 'password'
            });

            delayPromise(1000, session.login({token}))
                .then(() => setState({
                    ...state,
                    loading: false,
                    id: '',
                    password: '',
                    error: null
                }))
                .catch(() => setState({
                    ...state,
                    loading: false,
                    id: '',
                    password: '',
                    error: {error: '', statusCode: -1, message: 'Please login again', id: -1}
                }));
        }
    }, []);

    return (
        <div className={cn(styles.login, {
            [styles.visible]: sessionState.token === null
        })}>

            <svg version="1.1" viewBox="0 0 50 50">
                <path d="M21.3,15c0.4-2-0.8-2.9-0.7-3c0.3,0.2,1.6,0.4,1.7,2.1c0,1.1-0.2,2.3,0.4,3.3C22.7,17.5,20.9,17,21.3,15z"/>
                <path
                    d="M41.4,29L41,28.5c-0.7-1.1-2.4-3.8-2.9-4.7c0.2-0.9-0.2-1.6-0.6-2.1c-1.1-1.2-2.9-2.9-5.5-4.1  c-0.9-2.9-2.9-3.4-4.7-3.8c-1.2-0.3-1.8-0.5-3.1-1.5c-1.3-1-2.8-0.8-3.1-0.8c-0.3,0,1.6,0.4,1.7,2.1s-0.6,3.2,2.3,5.3  c-0.9,0.4-3.3,2-4.4,3c-1,1-3.1,2.3-6.4,3.2c-0.2,0.1-0.4,0.2-0.5,0.4c-0.1,0.2-0.1,0.4,0,0.6c0.2,0.4,0.9,0.8,1.6,1.1  c-1.7,0.7-4.8,1-6.8,1c-0.3,0-0.5,0.2-0.7,0.4C7.8,29,7.9,29.3,8,29.5c1.8,2.2,4.8,3.8,6.4,4.6c-0.5,0.3-1,0.6-1.6,0.8  c-0.3,0.1-0.5,0.3-0.5,0.6c0,0.3,0.1,0.6,0.4,0.7c6.4,3,5.7,3.4,8.9-0.4s5.6-0.9,7.9-2.2c2.2-1.3,5.8-1.6,7.4-0.8  c2,0.9,4.5-0.7,5-1.6C42.3,30.5,42.1,30.1,41.4,29z M32.4,24.6c-0.7-0.6-0.8-1.7-0.2-2.4l2.6,2.2C34.2,25.1,33.1,25.2,32.4,24.6zM38,31.9c0,0,2-0.6,2.3-1.4c0.3-0.8-0.7-2-0.7-2s0.9,0.7,1.5,1.7C41.7,31.3,38,31.9,38,31.9z"/>
            </svg>

            <div className={styles.form}>
                <InputField placeholder="Username / E-Mail"
                            disabled={state.loading}
                            icon="user"
                            ariaLabel="Username or email address"
                            error={state.error?.statusCode === 404 ? state.error.message : null}
                            value={state.id}
                            onChange={setId}/>

                <InputField placeholder="Password"
                            icon="lock"
                            disabled={state.loading}
                            password={true}
                            ariaLabel="Password"
                            error={state.error?.statusCode === 403 ? state.error.message : null}
                            value={state.password}
                            onSubmit={login}
                            onChange={setPassword}/>

                <div className={styles.formFooter}>
                    <p className={styles.errorMessage}>{
                        ![404, 403].includes(state.error?.statusCode || 0) && state.error?.message
                    }</p>

                    <Button text="Submit"
                            loading={state.loading}
                            disabled={!state.password || !state.id}
                            onClick={login}/>
                </div>
            </div>

        </div>
    );
};
