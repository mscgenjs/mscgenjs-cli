"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mscgenjs = require("mscgenjs");
const VALID_GRAPHICS_TYPES = Object.freeze(["svg", "png", "jpeg"]);
const VALID_OUTPUT_TYPES = VALID_GRAPHICS_TYPES.concat(mscgenjs.getAllowedValues().outputType.map((pValue) => pValue.name));
function isStdout(pFilename) {
    return "-" === pFilename;
}
function fileExists(pFilename) {
    try {
        if (!isStdout(pFilename)) {
            fs.accessSync(pFilename, fs.constants.R_OK);
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
function validNamedStyles() {
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
        .map((pValue) => pValue.name)
        .join(", ");
}
function validOutputType(pType) {
    if (VALID_OUTPUT_TYPES.some((pName) => pName === pType)) {
        return pType;
    }
    throw Error(`\n  error: '${pType}' is not a valid output type. mscgen_js can emit:` +
        `\n          - the grapics formats svg, jpeg and png` +
        `\n          - the text formats dot, doxygen, mscgen, msgenny, xu and json.\n\n`);
}
exports.validOutputType = validOutputType;
function validInputType(pType) {
    if (mscgenjs
        .getAllowedValues()
        .inputType
        .some((pValue) => pValue.name === pType)) {
        return pType;
    }
    throw Error(`\n  error: '${pType}' is not a valid input type.` +
        `\n         mscgen_js can read ${validInputTypes()}\n\n`);
}
exports.validInputType = validInputType;
function validNamedStyle(pStyle) {
    if (mscgenjs
        .getAllowedValues()
        .namedStyle
        .some((pValue) => pValue.name === pStyle)) {
        return pStyle;
    }
    throw Error(`\n  error: '${pStyle}' is not a recognized named style.` +
        `\n         You can use one of these: ${validNamedStyles()}\n\n`);
}
exports.validNamedStyle = validNamedStyle;
function validVerticalAlignment(pAlignment) {
    if (mscgenjs
        .getAllowedValues()
        .regularArcTextVerticalAlignment
        .some((pValue) => pValue.name === pAlignment)) {
        return pAlignment;
    }
    throw Error(`\n  error: '${pAlignment}' is not a recognized vertical alignment.` +
        `\n         You can use one of these: ${validVerticalAlignments()}\n\n`);
}
exports.validVerticalAlignment = validVerticalAlignment;
function validateArguments(pOptions) {
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
exports.validateArguments = validateArguments;
exports.validOutputTypeRE = VALID_OUTPUT_TYPES.join("|");
exports.validInputTypeRE = mscgenjs.getAllowedValues()
    .inputType
    .map((pValue) => pValue.name)
    .join("|");
exports.validNamedStyleRE = mscgenjs.getAllowedValues()
    .namedStyle
    .filter((pValue) => (pValue.experimental === false && pValue.deprecated === false))
    .map((pValue) => pValue.name)
    .join("|");
exports.validVerticalAlignmentRE = mscgenjs.getAllowedValues()
    .regularArcTextVerticalAlignment
    .map((pValue) => pValue.name)
    .join("|");
