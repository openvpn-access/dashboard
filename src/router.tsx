import {h, render} from 'preact';
import Router from 'preact-router';
import {AsyncRoute} from '@lib/AsyncRoute';

// TODO: Route-change transition?
const Main = () => (
    <Router>
        <AsyncRoute path="/" getComponent={() => import(/* webpackChunkName: "app" */'./pages/app/App')} default/>
        <AsyncRoute path="/forgot-password" getComponent={() => import(/* webpackChunkName: "forgot-password" */'./pages/forgot-password/ForgotPassword')}/>
        <AsyncRoute path="/reset-password" getComponent={() => import(/* webpackChunkName: "reset-password" */'./pages/reset-password/ResetPassword')}/>
        <AsyncRoute path="/verify-email" getComponent={() => import(/* webpackChunkName: "verify-email" */'./pages/verify-email/VerifyEmail')}/>
    </Router>
);

render(
    <Main/>,
    document.getElementById('app') as HTMLElement
);


