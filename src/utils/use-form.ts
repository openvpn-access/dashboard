import {StateUpdater, useState} from 'preact/hooks';

type FormFieldRegistration = {
    value: string;
    error: string | null;
    onChange: (v: string) => void;
};

type FieldValidator = [(v: string) => unknown, string];
type RegisterOptions = {
    validate?: Array<FieldValidator>;
    required?: boolean;
};

/**
 * Form state manager with errors and such.
 * @param base Form fields with base values.
 */
export const useForm = <T extends Record<string, string>>(base: T) => {
    const stateMap = new Map<keyof T, {
        opt: RegisterOptions | null,
        val: [string, StateUpdater<string>];
        err: [string | null, StateUpdater<string | null>];
    }>();

    for (const [name, value] of Object.entries(base)) {
        stateMap.set(name, {
            opt: null,
            val: useState(value),
            err: useState<string | null>(null)
        });
    }

    return {

        // Binds a new InputField to this form
        register(name: keyof T, opt: RegisterOptions = {}): FormFieldRegistration {
            const set = stateMap.get(name);
            if (!set) {
                throw new Error(`No field with name ${name}`);
            }

            set.opt = opt;
            return {
                error: set.err[0],
                value: set.val[0],
                onChange: set.val[1]
            };
        },

        /**
         * Validates this form
         * @return True if this form is valid
         */
        validate(): boolean {
            let ok = true;
            for (const {val, err, opt} of stateMap.values()) {
                if (!opt) {
                    continue;
                }

                const value = val[0];
                if (opt.required && !value.length) {
                    err[1]('Required');
                    ok = false;
                } else if (opt.validate) {
                    for (const [fn, msg] of opt.validate) {
                        if (!fn(value)) {
                            err[1](msg);
                            ok = false;
                        }
                    }
                }
            }

            return ok;
        },

        /**
         * Takes a callback function which gets called if the form is valid.
         * @param cb Function to be called if all fields are valid
         */
        onSubmit(cb: (d: T) => void): () => void {
            return () => {
                if (this.validate()) {
                    cb(this.values());
                }
            };
        },

        setErrors(state: Partial<T>): void {
            for (const [key, value] of Object.entries(state)) {
                stateMap.get(key)?.err[1](value);
            }
        },

        setValues(state: Partial<T>): void {
            for (const [key, value] of Object.entries(state)) {
                stateMap.get(key)?.val[1](value);
            }
        },

        setError(name: keyof T, err: string | null): void {
            stateMap.get(name)?.err[1](err);
        },

        setValue(name: keyof T, value: string): void {
            stateMap.get(name)?.val[1](value);
        },

        clearError(...names: Array<keyof T>): void {
            for (const name of names) {
                stateMap.get(name)?.err[1]('');
            }
        },

        clearValue(...names: Array<keyof T>): void {
            for (const name of names) {
                stateMap.get(name)?.val[1]('');
            }
        },

        clearErrors(): void {
            for (const {err} of stateMap.values()) {
                err[1](null);
            }
        },

        clearValues(): void {
            for (const {val} of stateMap.values()) {
                val[1]('');
            }
        },

        empty(...filter: Array<keyof T>): boolean {
            for (const [key, {val}] of stateMap.entries()) {
                if ((!filter.length || filter.includes(key)) && !val[0]) {
                    return true;
                }
            }

            return false;
        },

        values(): T {
            const obj = {} as Record<keyof T, string>;
            for (const [key, value] of stateMap.entries()) {
                obj[key] = value.val[0];
            }

            return obj as T;
        }
    };
};
