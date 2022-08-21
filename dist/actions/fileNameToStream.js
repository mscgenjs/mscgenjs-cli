"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInStream = exports.getOutStream = void 0;
const fs_1 = require("fs");
function getOutStream(pOutputTo) {
    if ("-" === pOutputTo) {
        return process.stdout;
    }
    return (0, fs_1.createWriteStream)(pOutputTo);
}
exports.getOutStream = getOutStream;
function getInStream(pInputFrom) {
    if ("-" === pInputFrom) {
        return process.stdin;
    }
    return (0, fs_1.createReadStream)(pInputFrom);
}
exports.getInStream = getInStream;
/*
    This file is part of mscgenjs-cli.
    mscgenjs-cli is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    mscgen_js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with mscgenjs-cli.  If not, see <http://www.gnu.org/licenses/>.
*/
