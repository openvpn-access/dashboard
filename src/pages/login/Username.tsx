import {ErrorCode} from '@api/enums/ErrorCode';
import {api} from '@api/index';
import {Button} from '@components/form/Button';
import {InputField} from '@components/form/InputField';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import {login} from './state';
import styles from './Username.module.scss';

type Props = {
    onSubmit: () => void;
};

export const Username: FunctionalComponent<Props> = props => {
    const [loading, setLoading] = useState(false);
    const form = useForm({login_id: ''});

    const submit = form.onSubmit(values => {
        setLoading(true);
        form.clearErrors();

        delayPromise(1000, api<{mfa_required: boolean;}>({
            method: 'POST',
            route: '/users/mfa',
            data: values
        })).then(data => {
            login.update({...data, ...values});
            props.onSubmit();
        }).catch(err => {
            switch (err.code) {
                case ErrorCode.USER_NOT_FOUND:
                    return form.setError('login_id', 'User not found');
            }
        }).finally(() => setLoading(false));
    });

    return (
        <form className={styles.form}
              onSubmit={submit}
              aria-label="Login first with your username">
            <InputField placeholder="Username / E-Mail"
                        disabled={loading}
                        icon="user"
                        ariaLabel="Username or email address"
                        autoFocus={true}
                        {...form.register('login_id')}/>

            <Button text="Submit"
                    icon="login"
                    ariaLabel="Continue with provided username / email"
                    loading={loading}
                    submit={true}
                    disabled={form.empty()}/>
        </form>
    );
};
