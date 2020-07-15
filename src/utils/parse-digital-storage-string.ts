const DIGITAL_STORAGE_REGEX = /^([\d]+([.,-][\d]*)?) *([bkmgtp])?b?$/i;

export const isDigitalStorageString = (s: string): boolean => {
    return !s.length || !!DIGITAL_STORAGE_REGEX.exec(s);
};

export const parseDigitalStorageString = (s: string): number => {
    const [, value = '1.0', , unit = 'b'] = DIGITAL_STORAGE_REGEX.exec(s) || [];
    const unitKey = unit[0].toLowerCase();
    const num = Number(value);
    return (10 ** ('bkmgtp'.indexOf(unitKey) * 3)) * num;
};
