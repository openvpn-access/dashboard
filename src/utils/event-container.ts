type EventContainerDefinitions = Record<string, Array<unknown>>;

export interface EventContainer<E extends EventContainerDefinitions> {
    emit<T extends keyof E>(name: T, ...args: E[T]): void;

    on<T extends keyof E>(event: T, listener: (...args: E[T]) => void): EventContainer<E>;

    off<T extends keyof E>(event: T, listener: (...args: E[T]) => void): EventContainer<E>;

    clear(): void;
}

export const createEventContainer = <E extends EventContainerDefinitions>(): EventContainer<E> => {
    const listeners = new Map();

    const container: EventContainer<E> = {
        emit<T extends keyof E>(name: T, ...args: E[T]): void {
            for (const listener of (listeners.get(name) || [])) {
                listener(...args);
            }
        },

        off<T extends keyof E>(event: T, listener: (...args: E[T]) => void): EventContainer<E> {
            listeners.set(event, [...(listeners.get(event) || [])].filter(v => v !== listener));
            return container;
        },

        on<T extends keyof E>(event: T, listener: (...args: E[T]) => void): EventContainer<E> {
            listeners.set(event, [...(listeners.get(event) || []), listener]);
            return container;
        },

        clear() {
            listeners.clear();
        }
    };

    return container;
};
