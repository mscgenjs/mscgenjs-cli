"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function getOutStream(pOutputTo) {
    /* istanbul ignore if */
    if ("-" === pOutputTo) {
        return process.stdout;
    }
    else {
        return fs_1.createWriteStream(pOutputTo);
    }
}
exports.getOutStream = getOutStream;
function getInStream(pInputFrom) {
    /* istanbul ignore if */
    if ("-" === pInputFrom) {
        return process.stdin;
    }
    else {
        return fs_1.createReadStream(pInputFrom);
    }
}
exports.getInStream = getInStream;
