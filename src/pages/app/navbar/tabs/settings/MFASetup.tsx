import {api} from '@api/index';
import {DBUser} from '@api/types';
import {Button} from '@components/form/Button';
import {PinField} from '@components/form/PinField';
import {session} from '@state/session';
import {uid} from '@utils/uid';
import {useForm} from '@utils/use-form';
import {Fragment, FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './MFASetup.module.scss';

type Props = {
    user: DBUser;
};

type MFAResponse = {
    secret: string;
    url: string;
    qr_code: string;
};

export const MFASetup: FunctionalComponent<Props> = ({user}) => {
    const [loading, setLoading] = useState(false);
    const [mfa, setMfa] = useState<MFAResponse | null>(null);
    const form = useForm({code: ''});

    useEffect(() => {

        // Request secret / qr-code if mfa has not been set up yet
        if (!user.mfa_activated) {
            void api<MFAResponse>({
                method: 'POST',
                route: `/users/${user.id}/mfa/generate`
            }).then(setMfa);
        }
    }, [user.mfa_activated]);

    const submit = (activate: boolean) => form.onSubmit(values => {
        setLoading(true);
        form.clearErrors();

        void api({
            method: 'PATCH',
            route: `/users/${user.id}/mfa`,
            data: {
                activate,
                code: values.code
            }
        }).then(() => {

            // Update local user
            session.updateUser({mfa_activated: activate});
        }).catch(() => {
            form.setError('code', 'Invalid code.');
        }).finally(() => {
            setLoading(false);
        });
    });

    const labelledById = uid('aria');
    return (
        <div role="option"
             className={styles.mfaSetup}
             aria-labelledby={labelledById}>
            <header>
                <h3>
                    <span>Multi Factor Authentication</span>
                    <bc-icon name={user.mfa_activated ? 'lock' : 'unlock'}/>
                </h3>
                <a href="https://www.nist.gov/itl/applied-cybersecurity/tig/back-basics-multi-factor-authentication"
                   target="_blank"
                   rel="noreferrer">What is this?</a>
            </header>

            <article id={labelledById}>
                Setting up 2FA increases the security of your account considerable.
                If you enable this we&apos;ll ask you for your code every time you login.
                Keep in mind that losing access to your code will result in losing access to your account, you&apos;ll have to
                contact an administrator to reset 2FA for you in this case!
            </article>

            {
                !user.mfa_activated && <Fragment>
                    <div className={styles.qrCode}
                         dangerouslySetInnerHTML={{__html: mfa?.qr_code || ''}}/>

                    <p className={styles.secret}>
                        Secret: <b>{mfa?.secret}</b>
                    </p>
                </Fragment>
            }

            <div className={styles.form}>
                <PinField disabled={loading}
                          length={6}
                          {...form.register('code')}/>

                <Button text={user.mfa_activated ? 'Deactivate' : 'Activate'}
                        icon={user.mfa_activated ? 'unlock' : 'lock'}
                        type={user.mfa_activated ? 'red' : 'primary'}
                        ariaLabel={user.mfa_activated ? 'Deactivate MFA' : 'Activate MFA'}
                        disabled={form.empty()}
                        loading={loading}
                        onClick={submit(!user.mfa_activated)}/>
            </div>
        </div>
    );
};
