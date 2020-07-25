import {h, render} from 'preact';
import Router from 'preact-router';
import {AsyncRoute} from '@lib/AsyncRoute';

const Main = () => (
    <Router>
        <AsyncRoute path="/" getComponent={() => import(/* webpackChunkName: "App" */'./pages/app/App')} default/>
        <AsyncRoute path="/reset-password" getComponent={() => import(/* webpackChunkName: "ResetPassword" */'./pages/reset-password/ResetPassword')}/>
        <AsyncRoute path="/verify-email" getComponent={() => import(/* webpackChunkName: "VerifyEmail" */'./pages/verify-email/VerifyEmail')}/>
    </Router>
);

render(
    <Main/>,
    document.getElementById('app') as HTMLElement
);


