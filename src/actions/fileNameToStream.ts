import { createReadStream, createWriteStream } from "fs";

export function getOutStream(pOutputTo: string): NodeJS.WritableStream {
    /* istanbul ignore if */
    if ("-" === pOutputTo) {
        return process.stdout;
    } else {
        return createWriteStream(pOutputTo);
    }
}

export function getInStream(pInputFrom: string): NodeJS.ReadableStream {
    /* istanbul ignore if */
    if ("-" === pInputFrom) {
        return process.stdin;
    } else {
        return createReadStream(pInputFrom);
    }
}
