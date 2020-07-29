import {LoadingIndicator} from '@components/LoadingIndicator';
import {Portal} from '@components/Portal';
import {session} from '@state/session';
import {useStore} from 'effector-react';
import {Fragment, FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import {InfoBar} from './InfoBar';
import {MFASetup} from './MFASetup';
import styles from './Settings.module.scss';
import {UpdateCredentials} from './UpdateCredentials';

type View = 'account' | 'security';

export const Settings: FunctionalComponent = () => {
    const [currentView, setView] = useState<View>('account');
    const {user} = useStore(session.store);

    const buttons = [
        ['Account', 'account', 'user'],
        ['Security', 'security', 'shield']
    ].map(([text, view, icon], index) => (
        <button key={index}
                data-current={currentView === view}
                onClick={() => setView(view as View)}>
            <bc-icon name={icon}/>
            <span>{text}</span>
        </button>
    ));

    return user ? (
        <div className={styles.settings}>

            <div className={styles.navBar}>
                {buttons}
            </div>

            <Portal className={styles.portal}
                    show={currentView}
                    views={{
                        'account': (
                            <Fragment>
                                <InfoBar/>
                                <UpdateCredentials/>
                            </Fragment>
                        ),
                        'security': (<MFASetup/>)
                    }}/>
        </div>
    ) : (<LoadingIndicator visible={true}/>);
};
