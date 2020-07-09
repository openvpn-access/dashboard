import {FunctionalComponent, h} from 'preact';
import styles from './Searchbar.module.scss';

export const SearchBar: FunctionalComponent = () => (
    <div className={styles.searchBar}>
        <bc-icon name="search"/>
        <input type="text"
               placeholder="Search users"
               aria-label="Search for users"/>
    </div>
);
