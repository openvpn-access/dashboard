/**
 * Simple date formatter using placeholders.
 */
export const formatDate = (format: string, date: number | string | Date = Date.now(), locales = 'en-us') => {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const pad = (v: number, a = 2) => String(v).padStart(a, '0');
    const getLocal = (name: string, type: string) => date.toLocaleString(locales, {[name]: type});
    const strMap: Record<string, string> = {
        'HH': pad(date.getHours()),
        'mm': pad(date.getMinutes()),
        'ss': pad(date.getSeconds()),
        'x': String(date.getTime()),
        'SSS': pad(date.getMilliseconds(), 4),
        'YYYY': pad(date.getFullYear(), 4),
        'MMMM': getLocal('month', 'long'),
        'MMM': getLocal('month', 'short'),
        'MM': pad(date.getMonth()),
        'M': getLocal('month', 'narrow'),
        'DDDD': getLocal('weekday', 'long'),
        'DDD': getLocal('weekday', 'short'),
        'DD': pad(date.getDate()),
        'D': getLocal('weekday', 'narrow')
    };

    return format.replace(
        new RegExp(Object.keys(strMap).join('|'), 'g'),
        match => strMap[match] || ''
    );
};
