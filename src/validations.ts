"use strict";
import * as fs from "fs";
import * as mscgenjs from "mscgenjs";
import { INormalizedOptions, NamedStyleType, OutputType } from "./types";

const VALID_GRAPHICS_TYPES  = Object.freeze(["svg", "png", "jpeg"]);
const VALID_OUTPUT_TYPES = VALID_GRAPHICS_TYPES.concat(
    mscgenjs.getAllowedValues().outputType.map((pValue) => pValue.name),
);

function isStdout(pFilename: string): boolean {
    return "-" === pFilename;
}

function fileExists(pFilename: string): boolean {
    try {
        if (!isStdout(pFilename)) {
            fs.accessSync(pFilename, fs.constants.R_OK);
        }
        return true;
    } catch (e) {
        return false;
    }
}

function validNamedStyles(): string {
    return mscgenjs.getAllowedValues()
        .namedStyle
        .filter((pValue) => pValue.experimental === false)
        .map((pNamedStyle) => pNamedStyle.name)
        .join(", ");
}

function validInputTypes() {
    return mscgenjs.getAllowedValues()
        .inputType
        .map((pInputType) => pInputType.name)
        .join(", ");
}

function validVerticalAlignments() {
    return mscgenjs.getAllowedValues()
        .regularArcTextVerticalAlignment
        // .filter(pValue => pValue.experimental === false)
        .map((pValue) => pValue.name)
        .join(", ");
}

export function validOutputType(pType: OutputType): OutputType {
    if (VALID_OUTPUT_TYPES.some((pName) => pName === pType)) {
        return pType;
    }

    throw Error(
        `\n  error: '${pType}' is not a valid output type. mscgen_js can emit:` +
        `\n          - the grapics formats svg, jpeg and png` +
        `\n          - the text formats dot, doxygen, mscgen, msgenny, xu and json.\n\n`,
    );
}

export function validInputType(pType: string): string {
    if (mscgenjs
        .getAllowedValues()
        .inputType
        .some((pValue) => pValue.name === pType)) {
        return pType;
    }

    throw Error(
        `\n  error: '${pType}' is not a valid input type.` +
        `\n         mscgen_js can read ${validInputTypes()}\n\n`);
}

export function validNamedStyle(pStyle: NamedStyleType): NamedStyleType {
    if (mscgenjs
        .getAllowedValues()
        .namedStyle
        .some((pValue) => pValue.name === pStyle)) {
        return pStyle;
    }

    throw Error(
        `\n  error: '${pStyle}' is not a recognized named style.` +
        `\n         You can use one of these: ${validNamedStyles()}\n\n`);
}

export function validVerticalAlignment(pAlignment: string): mscgenjs.RegularArcTextVerticalAlignmentType {
    if (mscgenjs
        .getAllowedValues()
        .regularArcTextVerticalAlignment
        .some((pValue) => pValue.name === pAlignment)) {
        return pAlignment as mscgenjs.RegularArcTextVerticalAlignmentType;
    }

    throw Error(
        `\n  error: '${pAlignment}' is not a recognized vertical alignment.` +
        `\n         You can use one of these: ${validVerticalAlignments()}\n\n`);
}

export function validateArguments(pOptions: INormalizedOptions): Promise<INormalizedOptions> {
    return new Promise((pResolve, pReject) => {
        if (!pOptions.inputFrom) {
            pReject(Error(`\n  error: Please specify an input file.\n\n`));
        }

        if (!pOptions.outputTo) {
            pReject(Error(`\n  error: Please specify an output file.\n\n`));
        }

        if (!fileExists(pOptions.inputFrom)) {
            pReject(Error(`\n  error: Failed to open input file '${pOptions.inputFrom}'\n\n`));
        }

        pResolve(pOptions);
    });
}

export const validOutputTypeRE = VALID_OUTPUT_TYPES.join("|");

export const validInputTypeRE = mscgenjs.getAllowedValues()
    .inputType
    .map((pValue) => pValue.name)
    .join("|");

export const validNamedStyleRE = mscgenjs.getAllowedValues()
    .namedStyle
    .filter((pValue) => (pValue.experimental === false && pValue.deprecated === false))
    .map((pValue) => pValue.name)
    .join("|");

export const validVerticalAlignmentRE = mscgenjs.getAllowedValues()
    .regularArcTextVerticalAlignment
    // .filter(pValue => pValue.experimental === false)
    .map((pValue) => pValue.name)
    .join("|");

/*
    This file is part of mscgen_js.

    mscgen_js is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    mscgen_js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
*/
