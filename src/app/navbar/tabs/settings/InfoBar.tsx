import {DBUser} from '@api/types';
import {Button} from '@components/form/Button';
import {FunctionalComponent, h} from 'preact';
import {Fragment} from 'react';
import styles from './InfoBar.module.scss';

type Props = {
    user: DBUser;
}

export const InfoBar: FunctionalComponent<Props> = ({user}) => {
    return (
        <div className={styles.infoBar}>

            <p className={styles.status}
               data-ok={user.activated}>
                {user.activated ?
                    <Fragment>
                        <span>You&apos;re account is activated!</span>
                        <bc-icon name="happy"/>
                    </Fragment> :
                    <Fragment>
                        <span>Your account has been deactivated by an administrator.</span>
                    </Fragment>
                }
            </p>

            {!user.email_verified && <p className={styles.status}>
                <span>Please verify your E-Mail address by clicking the link we&apos;ve send you!</span>
            </p>}
        </div>
    );
};
