import {DBUser} from '@api/types';
import {validation} from '@api/validation';
import {Button} from '@components/Button';
import {DropDown} from '@components/DropDown';
import {InputField} from '@components/InputField';
import {ErrorCode, api} from '@api/index';
import {users} from '@state/users';
import {delayPromise} from '@utils/promises';
import {useForm} from '@utils/use-form';
import {FunctionalComponent, h} from 'preact';
import {useState} from 'preact/hooks';
import styles from './UserEditBar.module.scss';

type Props = {
    user: DBUser;
    onSave: (v: false) => void;
};

export const UserEditBar: FunctionalComponent<Props> = ({user, onSave}) => {
    const [applyLoading, setApplyLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const isLoading = () => applyLoading || deleteLoading;

    const form = useForm({
        username: user.username,
        email: user.email,
        type: user.type
    });

    const submit = () => {
        setApplyLoading(true);

        delayPromise(500, api({
            method: 'PATCH',
            route: `/users/${user.username}`,
            data: form.values()
        })).then(newUser => {
            users.updateUser(newUser as DBUser);
            setApplyLoading(false);
            onSave(false);
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
            onSave(false);
        }).finally(() => {
            setDeleteLoading(false);
        });
    };

    return (
        <div className={styles.userEditBar}>
            <div className={styles.form}>
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
