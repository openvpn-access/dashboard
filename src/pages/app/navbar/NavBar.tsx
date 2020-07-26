import {Portal} from '@components/Portal';
import {session} from '@state/session';
import {cn} from '@utils/preact-utils';
import {staticStore} from '@utils/static-store';
import {useStore} from 'effector-react';
import {FunctionalComponent, h} from 'preact';
import {route} from 'preact-router';
import {useState} from 'preact/hooks';
import styles from './NavBar.module.scss';
import {Settings} from './tabs/settings/Settings';
import {Users} from './tabs/users/Users';

type View = 'Users' | 'Settings';

export const NavBar: FunctionalComponent = () => {
    const {user} = useStore(session.store);
    const [activeTab, changeTab] = useState<View>(
        env.NODE_ENV === 'development' ? staticStore.getJSON('--dev-') || 'Settings' : 'Settings'
    );

    const tabs = [
        ...(
            user?.type === 'admin' ? [{
                name: 'Users',
                icon: 'bulleted-list'
            }] : []
        ),
        {
            name: 'Settings',
            icon: 'settings'
        }
    ];

    const changeTabTo = (name: View) => () => {
        env.NODE_ENV === 'development' && staticStore.setJSON('--dev-', name);
        changeTab(name);
    };

    const logout = () => {
        route('/login');
        setTimeout(() => session.logout(), 300);
    };

    // Generate tabs and nav-buttons
    const tabButtons = [];
    for (const {name, icon} of tabs) {
        tabButtons.push(
            <button className={styles.tabButton}
                    data-active={name === activeTab}
                    aria-label={`Switch to tab: ${name}`}
                    onClick={changeTabTo(name as View)}>
                <bc-icon name={icon}/>
                <span>{name}</span>
            </button>
        );
    }

    return (
        <div className={styles.navBar}>
            <div className={styles.tabButtons}>
                {tabButtons}

                <button className={cn(styles.tabButton, styles.logout)}
                        aria-label="Logout"
                        onClick={logout}>
                    <bc-icon name="logout"/>
                    <span>Logout</span>
                </button>
            </div>

            <Portal className={styles.tabContaiers}
                    keepAlive={true}
                    show={activeTab}
                    views={{
                        'Settings': <Settings/>,
                        'Users': <Users/>
                    }}/>
        </div>
    );
};
