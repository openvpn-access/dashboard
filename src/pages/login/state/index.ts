import {createEvent, createStore} from 'effector';

type State = {
    login_id: string;
    mfa_required: boolean;
};

export const login = {
    state: createStore<State>({
        login_id: '',
        mfa_required: false
    }),

    update: createEvent<Partial<State>>()
};

login.state.on(login.update, (state, payload) => {
    return {...state, ...payload};
});
