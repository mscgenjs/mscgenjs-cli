"use strict";

import { CommanderStatic } from "commander";
import * as path from "path";
import { INormalizedOptions, IOptions, OutputType } from "./types";

const INPUT_EXTENSIONS = Object.freeze({
    ast     : "json",
    json    : "json",
    msc     : "mscgen",
    mscgen  : "mscgen",
    mscin   : "mscgen",
    msgenny : "msgenny",
    seq     : "mscgen",
    xu      : "xu",
});
const OUTPUT_EXTENSIONS = Object.freeze({
    ast     : "json",
    dot     : "dot",
    doxygen : "doxygen",
    jpeg    : "jpeg",
    jpg     : "jpeg",
    json    : "json",
    msc     : "mscgen",
    mscgen  : "mscgen",
    mscin   : "mscgen",
    msgenny : "msgenny",
    png     : "png",
    seq     : "mscgen",
    svg     : "svg",
    xu      : "xu",
});

/**
 * Given a filename in pString, returns what language is probably
 * contained in that file, judging from the extension (the last dot
 * in the string to end-of-string)
 *
 * When in doubt returns pDefault
 *
 * @param {string} pString - filename
 * @param {object} pExtensionMap - a dictionary with
 *        extension : classification pairs
 * @param {string} pDefault - the default to return when the extension
 *        does not occur in the extension map
 * @return  {string} - language. Possible values: LHS of the passed
 *        extension map.
 */
function classifyExtension(pString: string|undefined, pExtensionMap: any, pDefault: string): string {
    if (!pString) {
        return pDefault;
    }

    const lPos = pString.lastIndexOf(".");

    if (lPos > -1) {
        const lExt = pString.slice(lPos + 1);

        if (pExtensionMap[lExt]) {
            return pExtensionMap[lExt];
        }
    }

    return pDefault;
}

function deriveOutputFromInput(pInputFrom: string, pOutputType: OutputType): string | void {
    if (!pInputFrom || "-" === pInputFrom) {
        return;
    }
    return path.join(
        path.dirname(pInputFrom),
        path.basename(pInputFrom, path.extname(pInputFrom)),
    ).concat(".").concat(pOutputType);
}

function determineOutputTo(pOutputTo: string | undefined, pInputFrom: string, pOutputType: OutputType): string | void {
    return Boolean(pOutputTo) ? pOutputTo : deriveOutputFromInput(pInputFrom, pOutputType);
}

function determineInputType(pInputType: string|undefined, pInputFrom: string): string {
    if (pInputType) {
        return pInputType === "ast" ? "json" : pInputType;
    }
    return classifyExtension(pInputFrom, INPUT_EXTENSIONS, "mscgen");
}

function determineOutputType(
    pOutputType: string|undefined,
    pOutputTo: string|undefined,
    pParserOutput: string): OutputType {
    if (Boolean(pParserOutput)) {
        return "json";
    }
    if (Boolean(pOutputType)) {
        return pOutputType as OutputType;
    }
    if (Boolean(pOutputTo)) {
        return classifyExtension(pOutputTo, OUTPUT_EXTENSIONS, "svg") as OutputType;
    }
    return "svg";
}

/**
 * transforms the given argument and options to a uniform format
 *
 * - guesses the input type when not given
 * - guesses the output type when not given
 * - gueses the filename to output to when not given
 * - translates parserOutput to a regular output type
 *
 * @param  {string} pArgument an argument (containing the filename to parse)
 * @param  {object} pOptions a commander options object
 * @return {object} a commander options object with options 'normalized'
 */
export function normalize(pArgument: string, pOptions: CommanderStatic): INormalizedOptions {
    const lRetval = JSON.parse(JSON.stringify(pOptions));

    lRetval.inputFrom  = Boolean(pArgument) ? pArgument : pOptions.inputFrom;
    lRetval.inputType  =
        determineInputType(
            pOptions.inputType,
            lRetval.inputFrom,
        );
    lRetval.outputType =
        determineOutputType(
            pOptions.outputType,
            pOptions.outputTo,
            pOptions.parserOutput,
        );
    lRetval.outputTo   =
        determineOutputTo(
            pOptions.outputTo,
            lRetval.inputFrom,
            lRetval.outputType,
        );
    lRetval.regularArcTextVerticalAlignment = pOptions.verticalAlignment || "middle";

    return lRetval;
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
