import {AsyncRoute} from '@lib/async-route';
import {h, render} from 'preact';
import Router from 'preact-router';

const Main = () => (
    <Router>
        <AsyncRoute path="/" getComponent={() => import(/* webpackChunkName: "app" */'./app/App')} default/>
        <AsyncRoute path="/login" getComponent={() => import(/* webpackChunkName: "login" */'./login/Login')}/>
        <AsyncRoute path="/forgot-password" getComponent={() => import(/* webpackChunkName: "forgot-password" */'./forgot-password/ForgotPassword')}/>
        <AsyncRoute path="/reset-password" getComponent={() => import(/* webpackChunkName: "reset-password" */'./reset-password/ResetPassword')}/>
        <AsyncRoute path="/verify-email" getComponent={() => import(/* webpackChunkName: "verify-email" */'./verify-email/VerifyEmail')}/>
    </Router>
);

render(
    <Main/>,
    document.getElementById('app') as HTMLElement
);


