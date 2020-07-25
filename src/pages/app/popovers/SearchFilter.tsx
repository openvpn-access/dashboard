import {Button} from '@components/form/Button';
import {Checkbox} from '@components/form/Checkbox';
import {DropDown} from '@components/form/DropDown';
import {SortDirection} from '@components/form/SortDirection';
import {registerPopover} from '@lib/popover';
import {users} from '@state/users';
import {useForm} from '@utils/use-form';
import {h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './SearchFilter.module.scss';

const SORTING_FIELDS = {
    'id': 'ID',
    'created_at': 'Created at',
    'updated_at': 'Updated at',
    'type': 'Type',
    'state': 'Account state',
    'email': 'E-Mail Address',
    'email_verified': 'E-Mail verified',
    'username': 'Username'
};

registerPopover('search-filter', {
    info: {
        title: 'Filter',
        icon: 'filter'
    },

    component(props) {
        const [locked, setLocked] = useState(false);
        const form = useForm({
            ...users.filters.state.getState()
        });

        const apply = () => {
            setLocked(true);

            users.filters.update(form.values());
            users.items.refresh().finally(() => {
                setLocked(false);
                props.hidePopover();
            });
        };

        return (
            <div className={styles.searchFilter}>
                <section className={styles.sort}>
                    <p className={styles.label}>Sort list by</p>

                    <div>
                        <DropDown items={SORTING_FIELDS}
                                  disabled={locked}
                                  ariaLabel="Sort by propertie"
                                  {...form.register('sort')}/>

                        <SortDirection ariaLabel="Sorting direction"
                                       {...form.register('sort_dir')}/>
                    </div>
                </section>

                <section className={styles.type}>
                    <p className={styles.label}>Show only</p>

                    <div>
                        <p>With verified email</p>
                        <Checkbox allowIndeterminate={true}
                                  {...form.register('email_verified')}/>
                    </div>

                    <div>
                        <p>Activated users</p>
                        <Checkbox allowIndeterminate={true}
                                  {...form.register('activated')}/>
                    </div>

                    <div>
                        <p>Administrators</p>
                        <Checkbox allowIndeterminate={true}
                                  {...form.register('type', {
                                      mapValue: v => v === true ? 'admin' :
                                          v === null ? null : 'user'
                                  })}/>
                    </div>
                </section>

                <Button className={styles.btn}
                        text="Apply"
                        ariaLabel="Apply filter options"
                        disabled={locked}
                        onClick={form.onSubmit(apply)}/>
            </div>
        );
    }
});
