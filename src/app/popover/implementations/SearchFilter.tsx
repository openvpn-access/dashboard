import {Button} from '@components/form/Button';
import {DropDown} from '@components/form/DropDown';
import {SortDirection} from '@components/form/SortDirection';
import {PopoverBaseProps} from '@popover';
import {users} from '@state/users';
import {useForm} from '@utils/use-form';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import {Popover} from '../Popover';
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

export const SearchFilter: FunctionalComponent<PopoverBaseProps> = props => {
    const [locked, setLocked] = useState(false);
    const form = useForm({...users.searchConfig.getState()});

    const apply = () => {
        setLocked(true);

        users.updateConfig(form.values());
        users.updateView().finally(() => {
            setLocked(false);
            props.hidePopover();
        });
    };

    return (
        <Popover className={styles.searchFilter}
                 hidePopover={props.hidePopover}
                 icon="filter"
                 title="User Filter">

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

            <Button className={styles.btn}
                    text="Apply"
                    ariaLabel="Apply filter options"
                    disabled={locked}
                    onClick={form.onSubmit(apply)}/>
        </Popover>
    );
};
