import {FieldValidator} from '@utils/use-form';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const validation = {
    user: {
        username: [
            [v => v.length > 3, 'Must be longer than 3 characters'],
            [v => v.length < 50, 'Cannot be longer than 50 characters'],
            [v => /^[\w]+$/.exec(v), 'Can only contain alphanumeric characters']
        ] as Array<FieldValidator>,
        password: [
            [v => v.length > 8, 'Minimum length is 8 characters '],
            [v => v.length < 50, 'Cannot be longer than 50 characters'],
            [v => /^[\S]+$/.exec(v), 'May not contain whitespace']
        ] as Array<FieldValidator>,
        email: [
            [v => EMAIL_REGEX.exec(v), 'Please enter a valid email-address.']
        ] as Array<FieldValidator>
    }
};
