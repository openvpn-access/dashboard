import {FieldValidator} from '@utils/use-form';

const validateEmail = (() => {
    const LOCAL_DOMAIN_REGEXP = /\.[^@]+$/;
    const input = document.createElement('input');
    input.type = 'email';
    input.required = true;

    return (s: string) => {
        input.value = s;

        // TODO: Some emails do not pass server-side validation, see https://github.com/sideway/joi/issues/2439
        // Remove LOCAL_DOMAIN_REGEXP after fix.
        return input.checkValidity() && LOCAL_DOMAIN_REGEXP.test(s);
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
