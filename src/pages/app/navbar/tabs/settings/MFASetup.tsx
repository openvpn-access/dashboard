import {api} from '@api/index';
import {DBUser} from '@api/types';
import {Button} from '@components/form/Button';
import {PinField} from '@components/form/PinField';
import {session} from '@state/session';
import {downloadFile} from '@utils/download';
import {uid} from '@utils/uid';
import {useForm} from '@utils/use-form';
import {Fragment, FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './MFASetup.module.scss';

type MFAResponse = {
    secret: string;
    url: string;
    qr_code: string;
};

const formatMfaBackupCode = (code: string) => `${code.slice(0, 4)}-${code.slice(4)}`;

export const MFASetup: FunctionalComponent = () => {
    const user = session.store.getState().user as DBUser;
    const [loading, setLoading] = useState(false);
    const [mfaCode, setMfaCode] = useState<MFAResponse | null>(null);
    const [mfaBackupCodes, setMfaBackupCodes] = useState<Array<string> | null>([
            '24313726', '92941176',
            '21176471', '85882353',
            '76078431', '59607843',
            '92156862', '67450980',
            '05098040', '55686274'
        ]
    );

    const form = useForm({code: ''});

    useEffect(() => {

            // Request secret / qr-code if mfa has not been set up yet
            if (!user.mfa_activated) {
                void api<MFAResponse>({
                    method: 'POST',
                    route: `/users/${user.id}/mfa/generate`
                }).then(setMfaCode);
            }
        }, [user.mfa_activated]
    );

    const downloadMfaBackupCodes = () => {
        if (mfaBackupCodes) {
            const codes = mfaBackupCodes
                .map((v, i) => `${i + 1}. ${formatMfaBackupCode(v)}`)
                .join('\n');

            mfaBackupCodes && downloadFile(
                'backup-codes.txt',
                `
These are your OpenVPN Access backup codes. Keep them somewhere safe but accessible.
In case you lose your phone you'll be able to reset your MFA settings using them.

${codes}

If you're running into problems, contact your system administrator.
                `.trim()
            );
        }

    };

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
        }).then(response => {
            setMfaBackupCodes(activate ? (response as {backupCodes: Array<string>}).backupCodes : null);

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
                mfaBackupCodes && <div className={styles.backupCodes}>
                    <article>Keep these backup codes somewhere safe but accessible. In case you lose access to your device you can use them to reset MFA!
                    </article>
                    <div className={styles.list}>
                        {
                            mfaBackupCodes
                                .map(formatMfaBackupCode)
                                .map((code, i) => <span key={i} className={styles.code}>{String(i + 1).padStart(2, '0')}. {code}</span>)
                        }
                    </div>

                    <div className={styles.buttonBar}>
                        <Button onClick={() => setMfaBackupCodes(null)} text="I saved them!"/>
                        <Button onClick={downloadMfaBackupCodes} text="Download"/>
                    </div>
                </div>
            }

            {
                !user.mfa_activated && <Fragment>
                    <div className={styles.qrCode}
                         dangerouslySetInnerHTML={{__html: mfaCode?.qr_code || ''}}/>

                    <p className={styles.secret}>
                        Secret: <b>{mfaCode?.secret}</b>
                    </p>
                </Fragment>
            }

            <form className={styles.form}
                  onSubmit={submit(!user.mfa_activated)}>
                <PinField disabled={loading}
                          length={6}
                          ariaLabel="Authenticator code"
                          {...form.register('code')}/>

                <Button text={user.mfa_activated ? 'Deactivate' : 'Activate'}
                        icon={user.mfa_activated ? 'unlock' : 'lock'}
                        type={user.mfa_activated ? 'red' : 'primary'}
                        ariaLabel={user.mfa_activated ? 'Deactivate MFA' : 'Activate MFA'}
                        disabled={form.empty()}
                        loading={loading}
                        submit={true}/>
            </form>
        </div>
    );
};
