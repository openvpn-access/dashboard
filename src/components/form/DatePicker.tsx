import {InputField} from './InputField';
import {Popper} from '../Popper';
import day, {Dayjs} from 'dayjs';
import {FunctionalComponent, h} from 'preact';
import {useRef, useState} from 'preact/hooks';
import {JSXInternal} from 'preact/src/jsx';
import styles from './DatePicker.module.scss';

type Falsish = null | false | undefined;

type Props = {
    placeholder?: string;
    value: Date | number | null;
    error?: string | Falsish;
    nullable?: boolean;
    onChange: (d: Date | null) => void;
};

export const DatePicker: FunctionalComponent<Props> = props => {
    const currentDate = day(props.value || Date.now());
    const popper = useRef<Popper>();

    const [view, setView] = useState<'day' | 'month' | 'year'>('day');
    const [date, setDate] = useState(currentDate.startOf('month'));

    const reset = (e: MouseEvent) => {
        props.onChange(null);
        e.stopPropagation();
    };

    const toggleView = () => {
        switch (view) {
            case 'day':
                return setView('month');
            case 'month':
                return setView('year');
            case 'year':
                return setView('day');
        }
    };

    const getTitle = () => {
        switch (view) {
            case 'day':
                return date.format('MMMM YYYY');
            case 'month':
                return date.format('YYYY');
            case 'year':
                return `${date.year()} - ${date.year() + 11}`;
        }
    };

    const single = (multiplier = 1) => () => {
        switch (view) {
            case 'day':
                return setDate(date.add(multiplier, 'month'));
            case 'month':
                return setDate(date.add(multiplier, 'year'));
            case 'year':
                return setDate(date.add(10 * multiplier, 'year'));
        }
    };

    const double = (multiplier = 1) => () => {
        switch (view) {
            case 'day':
                return setDate(date.add(multiplier, 'year'));
            case 'month':
                return setDate(date.add(multiplier * 10, 'year'));
            case 'year':
                return setDate(date.add(20 * multiplier, 'year'));
        }
    };

    const viewEl = (): Array<JSXInternal.Element> => {
        switch (view) {
            case 'day': {
                const elements = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    .map((v, i) => <p key={i}>{v}</p>);

                const month = date.month();
                let di = date.startOf('week');
                const handler = (d: Dayjs) => () => {

                    // If user clicks days not related to the current month jump to the next / previous one
                    if (d.isAfter(date.endOf('month'))) {
                        setDate(date.add(1, 'month'));
                    } else if (d.isBefore(date.startOf('month'))) {
                        setDate(date.subtract(1, 'month'));
                    }

                    props.onChange(d.toDate());
                    popper.current?.toggle();
                };

                do {
                    const selected = props.value !== null && di.isSame(props.value, 'day');
                    const indirect = di.month() !== month;

                    elements.push(
                        <button data-selected={selected}
                                data-indirect={indirect}
                                key={elements.length}
                                onClick={handler(di)}
                                type="button">{di.date()}</button>
                    );

                    di = di.add(1, 'day');
                } while (di.month() === month || di.day() !== 0);

                return elements;
            }
            case 'month': {
                const handler = (date: Dayjs) => () => {
                    setView('day');
                    setDate(date);
                };

                return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    .map((v, index) =>
                        <button key={index}
                                data-selected={date.month() === index}
                                onClick={handler(date.set('month', index))}
                                type="button">{v}</button>
                    );
            }
            case 'year': {
                const elements = [];
                const yearOffset = date.year() - date.year() % 10;
                let di = date.set('year', yearOffset);

                const handler = (date: Dayjs) => () => {
                    setView('month');
                    setDate(date);
                };

                do {
                    elements.push(
                        <button data-selected={di.year() === date.year()}
                                key={elements.length}
                                onClick={handler(di)}
                                type="button">{di.year()}</button>
                    );

                    di = di.add(1, 'year');
                } while (di.year() !== yearOffset + 12);

                return elements;
            }
        }
    };

    return (
        <Popper
            ref={popper}
            button={
                <InputField value={props.value ? currentDate.format('DD.MM.YYYY') : undefined}
                            placeholder={props.placeholder}
                            error={props.error}
                            icon="calendar"
                            onClick={true}
                            afterInput={
                                <button className={styles.clear}
                                        aria-label="Clear"
                                        onClickCapture={reset}
                                        type="button"
                                        data-visible={!!(props.nullable && props.value)}>
                                    <bc-tooltip content="Reset"/>
                                    <bc-icon name="delete"/>
                                </button>
                            }/>
            }
            content={
                <div className={styles.datePicker}>

                    <div className={styles.controls}>
                        <button onClick={double(-1)} type="button">«</button>
                        <button onClick={single(-1)} type="button">‹</button>

                        <button className={styles.title}
                                type="button"
                                onClick={toggleView}>{getTitle()}</button>

                        <button onClick={single(1)} type="button">›</button>
                        <button onClick={double(1)} type="button">»</button>
                    </div>

                    <div className={styles.view}
                         data-type={view}>
                        {viewEl()}
                    </div>
                </div>
            }/>
    );
};
