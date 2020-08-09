import {ErrorCode} from '@api/index';
import {DBUser} from '@api/types';
import {validation} from '@api/validation';
import {Button} from '@components/form/Button';
import {BytePicker} from '@components/form/BytePicker';
import {Checkbox} from '@components/form/Checkbox';
import {DatePicker} from '@components/form/DatePicker';
import {DropDown} from '@components/form/DropDown';
import {InputField} from '@components/form/InputField';
import {registerPopover} from '@lib/popover';
import {isUserAccountLocked, users} from '@state/users';
import {cn} from '@utils/preact-utils';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import styles from './UserEditor.module.scss';

type Props = {
    newUser?: boolean;
    user?: DBUser;
};

registerPopover<Props>('user-editor', {
    info({newUser}) {
        return {
            icon: newUser ? 'starburst-shape' : 'edit',
            title: newUser ? 'Add a new user' : 'Modify a user'
        };
    },

    component({user = {}, newUser, hidePopover}) {
        const [applyLoading, setApplyLoading] = useState(false);
        const [deleteLoading, setDeleteLoading] = useState(false);
        const [confirmDelete, setConfirmDelete] = useState(false);
        const [accountLocked, setAccountLocked] = useState(false);
        const [restricted, setRestricted] = useState<boolean>(!!(user.transfer_limit_start || user.transfer_limit_end || user.transfer_limit_bytes));
        const isLoading = () => applyLoading || deleteLoading;

        const form = useForm<Partial<DBUser>>({
            username: user.username,
            email: user.email,
            type: user.type || 'user',
            activated: user.activated,
            password: user.password,
            mfa_activated: user.mfa_activated,
            transfer_limit_period: user.transfer_limit_period,
            transfer_limit_start: user.transfer_limit_start,
            transfer_limit_end: user.transfer_limit_end,
            transfer_limit_bytes: user.transfer_limit_bytes
        });

        const submit = form.onSubmit(values => {
            setApplyLoading(true);
            const data = {
                ...values,
                ...(!restricted && {
                    transfer_limit_period: null,
                    transfer_limit_start: null,
                    transfer_limit_end: null,
                    transfer_limit_bytes: null
                })
            } as Partial<DBUser>;

            const promise = newUser ? users.items.insert(data) :
                users.items.update([data, user.id as number]);

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
            }).finally(() => {
                setApplyLoading(false);
                form.reset();
            });
        });

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
            <form aria-label={newUser ? 'Create a new user' : 'Edit user'}
                  className={styles.userEditor}
                  onSubmit={submit}>

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
                                                type="password"
                                                disabled={isLoading()}
                                                {...form.register('password', {
                                                    validate: validation.user.password
                                                })}/>}

                        <div className={styles.checkBox}>
                            <p>Activated</p>
                            <Checkbox {...form.register('activated')}/>
                        </div>

                        <div className={styles.checkBox}>
                            <p>MFA <small>(Can only be deactivated)</small></p>
                            <Checkbox disabled={!user.mfa_activated} {...form.register('mfa_activated')}/>
                        </div>
                    </section>

                    <section className={styles.restrictions}>
                        <div className={styles.header}>
                            <h3>Limit usage</h3>
                            <Checkbox onChange={setRestricted}
                                      value={restricted}/>
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
                            submit={true}/>
                </div>
            </form>
        );
    }
});

