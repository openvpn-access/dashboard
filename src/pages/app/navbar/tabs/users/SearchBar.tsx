import {IconButton} from '@components/form/IconButton';
import {showPopover} from '@lib/popover';
import {users} from '@state/users';
import {debounce} from '@utils/debounce';
import {createNativeEventContainer} from '@utils/events';
import {createRef, FunctionalComponent, h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './Searchbar.module.scss';

export const SearchBar: FunctionalComponent = () => {
    const [locked, setLocket] = useState(false);
    const input = createRef<HTMLInputElement>();

    const updateQuery = debounce(() => {
        if (input.current) {
            setLocket(true);

            // Update search-query and user table
            users.filters.update({
                page: 1,
                search: input.current.value || undefined
            });

            // Refresh list
            users.items.refresh()
                .finally(() => setLocket(false));
        }
    }, 1500);

    // Focus if user presses ctrl+f and clear on escape
    useEffect(() => {
        const events = createNativeEventContainer();

        events.on(window, 'keydown', (e: KeyboardEvent) => {
            const el = input.current;

            if (el) {
                const key = e.key.toLowerCase();

                if ((e.ctrlKey || e.metaKey) && key === 'f') {
                    el.focus();
                    e.preventDefault();
                } else if (document.activeElement === el && key === 'escape') {
                    el.value = '';
                    updateQuery();
                }

            }
        });

        return events.unbind;
    }, [input]);

    return (
        <div className={styles.searchBar}>
            <bc-icon name="search"/>

            {/* TODO: spellCheck={false} does not work, any workarounds? */}
            <input type="text"
                   readOnly={locked}
                   ref={input}
                   placeholder="Search users"
                   aria-label="Search for users"
                   onInput={updateQuery}/>

            <IconButton icon="filter"
                        title="Filter search"
                        onClick={() => showPopover('search-filter')}/>

            <IconButton icon="plus"
                        title="Add new user"
                        onClick={() => showPopover('user-editor', {newUser: true})}/>
        </div>
    );
};
