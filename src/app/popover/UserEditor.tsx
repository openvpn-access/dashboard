import {api, ErrorCode} from '@api/index';
import {DBUser} from '@api/types';
import {validation} from '@api/validation';
import {Button} from '@components/Button';
import {Checkbox} from '@components/Checkbox';
import {DatePicker} from '@components/DatePicker';
import {DropDown} from '@components/DropDown';
import {InputField} from '@components/InputField';
import {PopoverBaseProps} from '@popover';
import {users} from '@state/users';
import {cn} from '@utils/preact-utils';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './UserEditor.module.scss';

type Props = {
    user: DBUser;
};

export const UserEditor: FunctionalComponent<PopoverBaseProps<Props>> = ({user, hidePopover}) => {
    const [applyLoading, setApplyLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [restricted, setRestricted] = useState<boolean>(!!(user.transfer_limit_start || user.transfer_limit_end || user.transfer_limit_bytes));

    const isLoading = () => applyLoading || deleteLoading;

    const form = useForm({
        username: user.username,
        email: user.email,
        type: user.type,
        transfer_limit_period: user.transfer_limit_period,
        transfer_limit_start: user.transfer_limit_start,
        transfer_limit_end: user.transfer_limit_end,
        transfer_limit_bytes: user.transfer_limit_bytes
    });

    const submit = () => {
        setApplyLoading(true);

        delayPromise(500, api({
            method: 'PATCH',
            route: `/users/${user.username}`,
            data: {
                ...form.values(),
                ...(restricted && {
                    transfer_limit_period: null,
                    transfer_limit_start: null,
                    transfer_limit_end: null,
                    transfer_limit_bytes: null
                })
            }
        })).then(newUser => {
            users.updateUser(newUser as DBUser);
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
        api({
            method: 'DELETE',
            route: `/users/${user.username}`
        }).then(() => {
            users.removeUser(user.username);
            hidePopover();
        }).finally(() => {
            setDeleteLoading(false);
        });
    };

    return (
        <div className={styles.userEditor}>
            <div className={styles.form}>

                <section className={styles.fields}>
                    <div className={styles.header}>
                        <h3>Credentials and account type</h3>
                    </div>

                    <DropDown items={{
                        admin: 'Admin',
                        user: 'User'
                    }} selected={form.getValue('type')}
                              icon={form.getValue('type')}
                              onSelect={v => form.setValue('type', v)}/>

                    <InputField placeholder="Username"
                                ariaLabel="Update this users username"
                                icon="user"
                                disabled={isLoading()}
                                {...form.register('username', {
                                    validate: validation.user.username
                                })}/>

                    <InputField placeholder="E-Mail"
                                ariaLabel="Update this users email"
                                icon="envelope"
                                disabled={isLoading()}
                                {...form.register('email', {
                                    validate: validation.user.email
                                })}/>
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
                    </div>
                </section>
            </div>

            <div className={styles.actionBar}>
                <Button text={confirmDelete ? 'Confirm deletion' : 'Delete user'}
                        type="red"
                        icon="trash-can"
                        ariaLabel={confirmDelete ? 'Confirm deletion' : 'Delete user'}
                        loading={deleteLoading}
                        disabled={applyLoading}
                        onClick={deleteUser}/>

                <Button text="Save"
                        icon="save"
                        ariaLabel="Save changes"
                        loading={applyLoading}
                        disabled={deleteLoading}
                        onClick={form.onSubmit(submit)}/>
            </div>
        </div>
    );
};
