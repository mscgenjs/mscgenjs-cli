export = (pError: Error|any): string => {
    if (Boolean(pError.location)) {
        /* tslint:disable-next-line */
        return `\n  syntax error on line ${pError.location.start.line}, column ${pError.location.start.column}:\n  ${pError.message}\n\n`;
    } else {
        return `${pError.message}`;
    }
};
