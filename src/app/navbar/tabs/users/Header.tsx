import {HelpCard} from '@components/HelpCard';
import {FunctionalComponent, h} from 'preact';
import styles from './Header.module.scss';

// TODO: Make this whole table thing a component!
export const Header: FunctionalComponent = () => (
    <div className={styles.header}>
        <p className={styles.id}>
            #
        </p>

        <div className={styles.type}>
            <HelpCard className={styles.userHelp}
                      label="Show help about user column">
                <bc-icon name="user"/>
                <p>User</p>
                <bc-icon name="admin"/>
                <p>Admin</p>
            </HelpCard>
        </div>

        <div className={styles.state}>
            <HelpCard className={styles.stateHelp}
                      label="Show help about status column">
                <div data-state="activated"/>
                <p>Activated</p>
                <div data-state="pending"/>
                <p>Pending</p>
                <div data-state="deactivated"/>
                <p>Deactivated</p>
            </HelpCard>
        </div>

        <p>Username</p>
        <p>E-Mail Address</p>
        <p>Created </p>
        <p>Updated</p>
        <p>Edit</p>
    </div>
);
