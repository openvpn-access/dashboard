import {users} from '@state/users';
import {useStore} from 'effector-react';
import {FunctionalComponent, h} from 'preact';
import {useRef} from 'preact/hooks';
import styles from './PageBar.module.scss';

export const PageBar: FunctionalComponent = () => {
    const {page, per_page} = useStore(users.filters.state);
    const {total_users_count} = useStore(users.stats.state);
    const spinner = useRef<HTMLDivElement>();

    const totalPages = Math.ceil(total_users_count / per_page);
    const buttons: Array<number> = [];

    const PPAD = 2;
    const paginatorPadding = Math.min(PPAD, Math.floor(totalPages / PPAD)) + PPAD;
    for (let i = page - paginatorPadding; i <= page + paginatorPadding; i++) {
        buttons.push(i);
    }

    const jumpTo = (page: number) => () => {
        const pad = spinner.current;

        if (pad) {
            const padRec = pad.getBoundingClientRect();
            const btnWidth = padRec.width / (PPAD * 4 + 1);
            const numOffset = buttons.indexOf(page) - PPAD * 2;
            const xOffset = btnWidth * numOffset;

            if (numOffset > (PPAD * -2) && numOffset < PPAD * 2) {

                /**
                 * All data driven, always use state, never alter dom manually
                 * yadda yadda yadda, this is the quickest way to do it, it works flawlessy and I
                 * believe for the sake of simplicity I can keep it that way.
                 */
                pad.setAttribute('data-moving', 'true');
                pad.style.transform = `translateX(calc(${-xOffset}px - 50%))`;
            } else {

                // We're moving to first / last page. Now make things more snappy
                pad.setAttribute('data-hiding', 'true');
            }

            setTimeout(() => {
                pad.removeAttribute('data-moving');
                pad.removeAttribute('data-hiding');
                pad.style.transform = 'translateX(calc(-50%))';
                users.filters.update({page});
                void users.items.refresh(); // TODO: Show loading indicator?
            }, 300);
        }
    };

    const pad = Math.max(2, String(buttons[buttons.length - 1]).length);
    return (
        <div className={styles.pageBar}>
            <button className={styles.first}
                    type="button"
                    aria-label="Jump to first page"
                    disabled={page === 1}
                    onClick={jumpTo(1)}>
                First
            </button>

            <div className={styles.spinner}>
                <div className={styles.fake}>
                    {buttons.slice(PPAD, -PPAD).map((value, index) =>
                        <button key={index} className={styles.number} type="button">
                            {String(value).padStart(pad, '0')}
                        </button>
                    )}
                </div>

                <div className={styles.real}
                     ref={spinner}>
                    {buttons.map((value, index) =>
                        <button key={index}
                                type="button"
                                aria-label={`Jump to page ${index}`}
                                onClick={jumpTo(value)}
                                data-invisible={value <= 0 || value > totalPages}
                                data-current={value === page}
                                className={styles.number}>
                            {String(value).padStart(pad, '0')}
                        </button>
                    )}
                </div>
            </div>

            <button className={styles.last}
                    type="button"
                    aria-label="Jump to last page"
                    disabled={page === totalPages}
                    onClick={jumpTo(totalPages)}>
                Last
            </button>
        </div>
    );
};
