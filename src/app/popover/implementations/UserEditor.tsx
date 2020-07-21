import {ErrorCode} from '@api/index';
import {DBUser} from '@api/types';
import {validation} from '@api/validation';
import {Button} from '@components/form/Button';
import {BytePicker} from '@components/form/BytePicker';
import {Checkbox} from '@components/form/Checkbox';
import {DatePicker} from '@components/form/DatePicker';
import {DropDown} from '@components/form/DropDown';
import {InputField} from '@components/form/InputField';
import {PopoverBaseProps} from '@popover';
import {isUserAccountLocked, users} from '@state/users';
import {cn} from '@utils/preact-utils';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import {useEffect} from 'react';
import {Popover} from '../Popover';
import styles from './UserEditor.module.scss';

type Props = {
    newUser?: boolean;
    user?: DBUser;
};

export const UserEditor: FunctionalComponent<PopoverBaseProps<Props>> = ({user = {}, newUser, hidePopover}) => {
    const [applyLoading, setApplyLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [accountLocked, setAccountLocked] = useState(false);
    const [restricted, setRestricted] = useState<boolean>(!!(user.transfer_limit_start || user.transfer_limit_end || user.transfer_limit_bytes));
    const isLoading = () => applyLoading || deleteLoading;

    const form = useForm({
        username: user.username,
        email: user.email,
        type: user.type || 'user',
        password: user.password,
        transfer_limit_period: user.transfer_limit_period,
        transfer_limit_start: user.transfer_limit_start,
        transfer_limit_end: user.transfer_limit_end,
        transfer_limit_bytes: user.transfer_limit_bytes
    });

    const submit = () => {
        setApplyLoading(true);
        const data = {
            ...form.values(),
            ...(!restricted && {
                transfer_limit_period: null,
                transfer_limit_start: null,
                transfer_limit_end: null,
                transfer_limit_bytes: null
            })
        } as Partial<DBUser>;

        const promise = newUser ? users.items.insert(data) :
            users.items.update([data, user?.username as string]);

        delayPromise(500, promise).then(() => {
            setApplyLoading(false);
            hidePopover();
        }).catch(err => {
            switch (err.code) {
                case ErrorCode.LOCKED_USERNAME:
                    return form.setError('username', 'This user cannot change its username');
                case ErrorCode.DUPLICATE_EMAIL:
                    return form.setError('email', 'This email is already in use.');
                case ErrorCode.DUPLICATE_USERNAME:
                    return form.setError('username', 'This username is already in use.');
            }
        }).finally(() => setApplyLoading(false));
    };

    const deleteUser = () => {
        if (!confirmDelete) {
            return setConfirmDelete(true);
        }

        setDeleteLoading(true);
        users.items.delete(user?.id as number)
            .then(() => hidePopover())
            .finally(() => setDeleteLoading(false));
    };

    useEffect(() => {
        if (user?.username) {
            isUserAccountLocked(user.username)
                .then(setAccountLocked)
                .catch(() => null);
        }
    }, [user]);

    return (
        <Popover className={styles.userEditor}
                 icon={newUser ? 'starburst-shape' : 'edit'}
                 title={newUser ? 'Add a new user' : 'Modify a user'}
                 hidePopover={hidePopover}>

            {/* TODO: Add un-block button? */}
            <p className={styles.accountLocked}
               data-visible={accountLocked}>
                <span>This account is locked for a certain time period as the user entered his password wrong too often.</span>
            </p>

            <div className={styles.form}>
                <section className={styles.fields}>
                    <div className={styles.header}>
                        <h3>Credentials and account type</h3>
                    </div>

                    <DropDown items={{admin: 'Admin', user: 'User'}}
                              icon={form.getValue('type')}
                              {...form.register('type')}/>

                    <InputField placeholder="Username"
                                icon="user"
                                disabled={isLoading()}
                                {...form.register('username', {
                                    validate: validation.user.username
                                })}/>

                    <InputField placeholder="E-Mail"
                                icon="envelope"
                                disabled={isLoading()}
                                {...form.register('email', {
                                    validate: validation.user.email
                                })}/>

                    {newUser && <InputField placeholder="Password"
                                            icon="lock"
                                            password={true}
                                            disabled={isLoading()}
                                            {...form.register('password', {
                                                validate: validation.user.password
                                            })}/>}
                </section>

                <section className={styles.restrictions}>
                    <div className={styles.header}>
                        <h3>Limit usage</h3>
                        <Checkbox onChange={setRestricted}
                                  checked={restricted}/>
                    </div>

                    <div className={cn(styles.options, styles.fields)} data-visible={restricted}>
                        <DatePicker placeholder="Start date"
                                    nullable={true}
                                    {...form.register('transfer_limit_start')}/>

                        <DatePicker placeholder="End date"
                                    nullable={true}
                                    {...form.register('transfer_limit_end')}/>

                        <BytePicker placeholder="Unlimited"
                                    nullable={true}
                                    {...form.register('transfer_limit_bytes')}/>
                    </div>
                </section>
            </div>

            <div className={styles.actionBar}>
                {!newUser && <Button text={confirmDelete ? 'Confirm deletion' : 'Delete user'}
                                     type="red"
                                     icon="trash-can"
                                     ariaLabel={confirmDelete ? 'Confirm deletion' : 'Delete user'}
                                     loading={deleteLoading}
                                     disabled={applyLoading}
                                     onClick={deleteUser}/>}

                <Button text={newUser ? 'Add User' : 'Update'}
                        icon="upgrade"
                        ariaLabel={newUser ? 'Add user' : 'Save changes'}
                        loading={applyLoading}
                        disabled={deleteLoading}
                        onClick={form.onSubmit(submit)}/>
            </div>
        </Popover>
    );
};
