import {Button} from '@components/form/Button';
import {uid} from '@utils/uid';
import {FunctionalComponent, h} from 'preact';
import styles from './ErrorPage.module.scss';

type Props = {
    retry: () => void;
}

export const ErrorPage: FunctionalComponent<Props> = props => {
    const labelledById = uid('aria');

    return (
        <div role="dialog" aria-labelledby={labelledById} className={styles.errorPage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                    d="M25.983,13.342C25.988,13.228,26,13.116,26,13c0-4.418-3.582-8-8-8c-3.11,0-5.8,1.779-7.123,4.371C10.296,9.136,9.665,9,9,9 c-2.53,0-4.599,1.885-4.932,4.324C1.703,14.129,0,16.363,0,19c0,3.314,2.686,6,6,6h18c3.314,0,6-2.686,6-6 C30,16.382,28.321,14.162,25.983,13.342z M16.212,11.36l-0.2,6.473h-2.024l-0.2-6.473H16.212z M15.003,22.189 c-0.828,0-1.323-0.441-1.323-1.182c0-0.755,0.494-1.196,1.323-1.196c0.822,0,1.316,0.441,1.316,1.196 C16.319,21.748,15.825,22.189,15.003,22.189z"/>
            </svg>

            <h1>Whoopise, something went wrong...</h1>
            <p id={labelledById}>
                <span>This page failed to load, please check your ethernet connection.</span>
                <br/>
                <span>If this problem persists, contact your system administrator.</span>
            </p>
            <Button text="Reload Page"
                    onClick={props.retry}
                    ariaLabel="Retry loading the site."/>
        </div>
    );
};
