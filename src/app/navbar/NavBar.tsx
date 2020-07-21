import {session} from '@state/session';
import {cn} from '@utils/preact-utils';
import {staticStore} from '@utils/static-store';
import {useStore} from 'effector-react';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './NavBar.module.scss';
import {Settings} from './tabs/settings/Settings';
import {Users} from './tabs/users/Users';

export const NavBar: FunctionalComponent = () => {
    const {user} = useStore(session.store);
    const [activeTab, changeTab] = useState(
        env.NODE_ENV === 'development' ? staticStore.getJSON('--dev-') || 0 : 0
    );

    const tabs = [
        {
            name: 'Settings',
            icon: 'settings',
            com: <Settings/>
        }
    ];

    if (user?.type === 'admin') {
        tabs.splice(0, 0, {
            name: 'Users',
            icon: 'bulleted-list',
            com: <Users/>
        });
    }


    const tabContainers = [];
    const tabButtons = [];

    const changeTabTo = (index: number) => () => {
        env.NODE_ENV === 'development' && staticStore.setJSON('--dev-', index);
        changeTab(index);
    };

    // Generate tabs and nav-buttons
    for (let i = 0; i < tabs.length; i++) {
        const {name, icon, com} = tabs[i];
        const active = i === activeTab;

        tabContainers.push(
            <div className={cn(styles.tabContainer, {
                [styles.active]: active
            })}>{com}</div>
        );

        tabButtons.push(
            <button className={cn(styles.tabButton, {
                [styles.active]: active
            })}
                    aria-label={`Switch to tab: ${name}`}
                    onClick={changeTabTo(i)}>
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
                        onClick={() => session.logout()}>
                    <bc-icon name="logout"/>
                    <span>Logout</span>
                </button>
            </div>

            <div className={styles.tabContaiers}>{tabContainers}</div>
        </div>
    );
};
