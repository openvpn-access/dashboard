import {IconButton} from '@components/IconButton';
import {FunctionalComponent, h} from 'preact';
import styles from './Searchbar.module.scss';

export const SearchBar: FunctionalComponent = () => (
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
                    onClick={console.log}/>
    </div>
);
