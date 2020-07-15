import {IconButton} from '@components/IconButton';
import {showPopover} from '@popover';
import {FunctionalComponent, h} from 'preact';
import styles from './Searchbar.module.scss';

export const SearchBar: FunctionalComponent = () => {
    const createNewUser = () => showPopover('UserEditor', {
        newUser: true
    });

    return (
        <div className={styles.searchBar}>
            <bc-icon name="search"/>
            <input type="text"
                   placeholder="Search users"
                   aria-label="Search for users"/>

            <IconButton icon="filter"
                        title="Filter search"
                        onClick={console.log}/>

            <IconButton icon="plus"
                        title="Add new user"
                        onClick={createNewUser}/>
        </div>
    );
};
