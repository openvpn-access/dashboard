import {eventPath} from '@utils/event-path';
import {EventBindingArgs, off, on} from '@utils/events';
import {bind, cn} from '@utils/preact-utils';
import {createPopper, NanoPop, NanoPopPosition} from 'nanopop';
import {Component, createRef, h} from 'preact';
import {JSXInternal} from 'preact/src/jsx';
import styles from './Popper.module.scss';

type Props = {
    className?: string;
    position?: NanoPopPosition;
    style?: string;
    disabled?: boolean;
    content: JSXInternal.Element;
    button: JSXInternal.Element | ((open: boolean) => JSXInternal.Element);
};

type State = {
    open: boolean;
};

export class Popper extends Component<Props, State> {
    private readonly reference = createRef<HTMLDivElement>();
    private readonly container = createRef<HTMLDivElement>();
    private eventBindings: Array<EventBindingArgs> = [];
    private nanoPop: NanoPop | null = null;

    readonly state = {
        open: false
    };

    componentDidMount() {
        const ref = this.reference.current;
        const con = this.container.current;

        if (ref && con) {
            this.nanoPop = createPopper(ref, con, {
                position: this.props.position || 'bottom'
            });

            this.eventBindings = [
                on(window, ['resize', 'scroll'], () => {
                    if (this.state.open) {
                        this.updatePopperPosition();
                    }
                }),

                on(window, ['mousedown', 'touchstart'], (e: MouseEvent) => {
                    const path = eventPath(e);

                    if (this.state.open &&
                        !path.includes(this.reference.current as HTMLElement) &&
                        !path.includes(this.container.current as HTMLElement)) {
                        this.toggle();
                    }
                })
            ];
        }
    }

    componentWillUnmount() {
        this.nanoPop = null;

        for (const args of this.eventBindings) {
            off(...args);
        }
    }

    updatePopperPosition() {
        this.nanoPop?.update();
    }

    @bind
    toggle() {
        this.setState({
            open: !this.state.open
        });

        const container = this.container.current as HTMLElement;
        if (!this.state.open && !this.props.disabled) {
            container.style.display = 'block';
            this.updatePopperPosition();
        } else {
            setTimeout(() => {
                container.style.display = 'none';
            }, 300);
        }
    }

    render() {
        const {button, content, className = '', style} = this.props;
        const {open} = this.state;

        return (
            <div className={cn(styles.popper, className, {
                [styles.open]: open
            })} style={style}>
                <div ref={this.reference}
                     onClick={this.toggle}
                     className={styles.btn}>
                    {typeof button === 'function' ? button(open) : button}
                </div>

                <div ref={this.container}
                     className={styles.container}>
                    {content}
                </div>
            </div>
        );
    }
}
