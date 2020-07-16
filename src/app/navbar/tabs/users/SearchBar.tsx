import {IconButton} from '@components/IconButton';
import {showPopover} from '@popover';
import {users} from '@state/users';
import {debounce} from '@utils/debounce';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './Searchbar.module.scss';

export const SearchBar: FunctionalComponent = () => {
    const [locked, setLocket] = useState(false);

    const updateQuery = debounce((ev: Event) => {
        const target = ev.target as HTMLInputElement;
        setLocket(true);

        // Update search-query and user table
        users.updateSearchQuery(target.value);
        users.updateView().finally(() => setLocket(false));
    }, 1500);

    return (
        <div className={styles.searchBar}>
            <bc-icon name="search"/>

            {/* TODO: spellCheck={false} does not work, any workarounds? */}
            <input type="text"
                   readOnly={locked}
                   placeholder="Search users"
                   aria-label="Search for users"
                   onInput={updateQuery}/>

            <IconButton icon="filter"
                        title="Filter search"
                        onClick={console.log}/>

            <IconButton icon="plus"
                        title="Add new user"
                        onClick={() => showPopover('UserEditor', {newUser: true})}/>
        </div>
    );
};
