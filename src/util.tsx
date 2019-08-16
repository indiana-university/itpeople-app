/// checks if a string is empty or only whitespace/tabs
export const isNullOrWhitespace = (str:string) =>
    str === null || str.match(/^\s*$/) !== null;

/// checks if a string has a non-empty, non-whitespace value.
export const hasValue = (str: string) => 
    isNullOrWhitespace(str) === false;

export const join = (vals: string[], delimiter: string) => 
    vals.filter(hasValue).join(delimiter);