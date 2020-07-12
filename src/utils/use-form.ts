import {StateUpdater, useState} from 'preact/hooks';

type FormFieldRegistration = {
    value: string;
    error: string | null;
    onChange: (v: string) => void;
};

/**
 * Form state manager with errors and such.
 * @param base Form fields with base values.
 */
export const useForm = <T extends Record<string, string>>(base: T) => {
    const stateMap = new Map<keyof T, {
        val: [string, StateUpdater<string>];
        err: [string | null, StateUpdater<string | null>];
    }>();

    for (const [name, value] of Object.entries(base)) {
        stateMap.set(name, {
            val: useState(value),
            err: useState<string | null>(null)
        });
    }

    return {

        // Binds a new InputField to this form
        register(name: keyof T): FormFieldRegistration {
            const set = stateMap.get(name);
            if (!set) {
                throw new Error(`No field with name ${name}`);
            }

            return {
                error: set.err[0],
                value: set.val[0],
                onChange: set.val[1]
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

        clearError(name: keyof T): void {
            stateMap.get(name)?.err[1]('');
        },

        clearValue(name: keyof T): void {
            stateMap.get(name)?.val[1]('');
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

        empty(filter: Array<keyof T> = []): boolean {
            for (const [key, {val}] of stateMap.entries()) {
                if ((!filter.length || filter.includes(key)) && !val[0]) {
                    return true;
                }
            }

            return false;
        },

        values(): Record<keyof T, string> {
            const obj = {} as Record<keyof T, string>;
            for (const [key, value] of stateMap.entries()) {
                obj[key] = value.val[0];
            }

            return obj;
        }
    };
};