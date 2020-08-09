import {FieldValidator} from '@utils/use-form';

const validateEmail = (() => {
    const input = document.createElement('input');
    input.type = 'email';
    input.required = true;

    return (s: string) => {
        input.value = s;
        return input.checkValidity();
    };
})();

export const validation = {
    user: {
        username: [
            [v => !!v, 'Cannot be empty'],
            [v => v.length > 3, 'Must be longer than 3 characters'],
            [v => v.length < 50, 'Cannot be longer than 50 characters'],
            [v => /^[\w.]+$/.exec(v), 'Can only contain alphanumeric characters']
        ] as Array<FieldValidator>,
        password: [
            [v => !!v, 'Cannot be empty'],
            [v => v.length > 8, 'Minimum length is 8 characters '],
            [v => v.length < 50, 'Cannot be longer than 50 characters'],
            [v => /^[\S]+$/.exec(v), 'May not contain whitespace']
        ] as Array<FieldValidator>,
        email: [
            [v => !!v, 'Cannot be empty'],
            [validateEmail, 'Please enter a valid email-address.']
        ] as Array<FieldValidator>
    }
};
