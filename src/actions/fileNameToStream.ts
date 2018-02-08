import { createReadStream, createWriteStream } from "fs";

export function getOutStream(pOutputTo: string): NodeJS.WritableStream {
    if ("-" === pOutputTo) {
        return process.stdout;
    }
    return createWriteStream(pOutputTo);
}

export function getInStream(pInputFrom: string): NodeJS.ReadableStream {
    if ("-" === pInputFrom) {
        return process.stdin;
    }
    return createReadStream(pInputFrom);
}
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
