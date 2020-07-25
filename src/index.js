/* eslint-disable */
if (env.NODE_ENV === 'development') {

    // Inject react-hot-loader
    const runtime = require('react-refresh/runtime');
    runtime.injectIntoGlobalHook(window);

    if (module.hot) {
        module.hot.accept();
    }

    // See https://github.com/facebook/react/issues/16604#issuecomment-528663101
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => type => type;
} else if (env.NODE_ENV === 'production') {

    // Print user warning and cool message
    console.log('%c!!! Pasting something in here can give attackers access to your files !!!', `
        background: #ff252f;
        padding: 0.3em 0.5em;
        border-radius: 0.25em;
        color: #fff;
    `);

    console.log(`%c😎 Checkout the project on GitHub: https://github.com/openvpn-access/dashboard`, `
        background: #3d7cf9;
        padding: 0.3em 0.5em;
        border-radius: 0.25em;
        color: #fff;
    `);

    // Boring application logs and the service worker registration
    console.groupCollapsed(`[APP] Launching v${env.VERSION}`);
    console.log(`Build at ${new Date(env.BUILD_DATE).toUTCString()}`);
    console.groupEnd();
}

(async () => {
    await import('./web-components');
    await import('./styles/_global.scss');

    // TODO: Should we use preact-router?
    // const path = location.pathname;
    // if (path.startsWith('/verify-email')) {
    //     import('./pages/verify-email');
    // } else if (path.startsWith('/reset-password')) {
    //     import('./pages/reset-password');
    // } else {
    //     import('./router');
    // }

    import('./router');
})();
