import {session} from '@state/session';
import {cn} from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import {Settings} from '../tabs/settings/Settings';
import {Users} from '../tabs/users/Users';
import styles from './NavBar.module.scss';

const tabs = [
    {
        name: 'Users',
        icon: 'bulleted-list',
        com: <Users/>
    },
    {
        name: 'Settings',
        icon: 'settings',
        com: <Settings/>
    }
];

export const NavBar: FunctionalComponent = () => {
    const [activeTab, changeTab] = useState(0);
    const tabContainers = [];
    const tabButtons = [];

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
                    onClick={changeTab.bind(null, i)}>
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
