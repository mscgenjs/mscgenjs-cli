"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validVerticalAlignmentRE = exports.validNamedStyleRE = exports.validInputTypeRE = exports.validOutputTypeRE = void 0;
exports.validOutputType = validOutputType;
exports.validInputType = validInputType;
exports.validNamedStyle = validNamedStyle;
exports.validVerticalAlignment = validVerticalAlignment;
exports.validateArguments = validateArguments;
exports.validPuppeteerOptions = validPuppeteerOptions;
const ajv_1 = require("ajv");
const fs = require("node:fs");
const mscgenjs = require("mscgenjs");
/* tslint:disable-next-line */
const puppeteerOptionsSchema = require("./puppeteer-options.schema.json");
const VALID_GRAPHICS_TYPES = Object.freeze(["svg", "png", "jpeg"]);
const VALID_OUTPUT_TYPES = VALID_GRAPHICS_TYPES.concat(mscgenjs.getAllowedValues().outputType.map((pValue) => pValue.name));
const ajv = new ajv_1.default();
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
function getValidValues(pAttribute) {
    return mscgenjs.getAllowedValues()[pAttribute]
        .filter((pValue) => pValue.experimental === false)
        .map((pValue) => pValue.name)
        .join(", ");
}
function isValidValue(pAttribute, pCandidateValue) {
    return mscgenjs.getAllowedValues()[pAttribute].some((pValue) => pValue.name === pCandidateValue);
}
function validOutputType(pType) {
    if (VALID_OUTPUT_TYPES.some((pName) => pName === pType)) {
        return pType;
    }
    throw Error(`\n  error: '${pType}' is not a valid output type. mscgen_js can emit:` +
        `\n          - the grapics formats svg, jpeg and png` +
        `\n          - the text formats dot, doxygen, mscgen, msgenny, xu and json.\n\n`);
}
function validInputType(pType) {
    if (isValidValue("inputType", pType)) {
        return pType;
    }
    throw Error(`\n  error: '${pType}' is not a valid input type.` +
        `\n         mscgen_js can read ${getValidValues("inputType")}\n\n`);
}
function validNamedStyle(pStyle) {
    if (isValidValue("namedStyle", pStyle)) {
        return pStyle;
    }
    throw Error(`\n  error: '${pStyle}' is not a recognized named style.` +
        `\n         You can use one of these: ${getValidValues("namedStyle")}\n\n`);
}
function validVerticalAlignment(pAlignment) {
    if (isValidValue("regularArcTextVerticalAlignment", pAlignment)) {
        return pAlignment;
    }
    throw Error(`\n  error: '${pAlignment}' is not a recognized vertical alignment.` +
        `\n         You can use one of these: ${getValidValues("regularArcTextVerticalAlignment")}\n\n`);
}
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
function validPuppeteerOptions(pPuppeteerConfigFileName) {
    let lPuppeteerConfigFileContents = "";
    let lPuppeteerConfigObject = {};
    try {
        lPuppeteerConfigFileContents = fs.readFileSync(pPuppeteerConfigFileName, "utf8");
    }
    catch (pException) {
        throw Error(`\n  error: Failed to open puppeteer options configuration file '${pPuppeteerConfigFileName}'\n\n`);
    }
    try {
        lPuppeteerConfigObject = JSON.parse(lPuppeteerConfigFileContents);
    }
    catch (pException) {
        throw Error(`\n  error: '${pPuppeteerConfigFileName}' does not contain valid JSON\n\n`);
    }
    if (!ajv.validate(puppeteerOptionsSchema, lPuppeteerConfigObject)) {
        throw Error(`\n  error: '${pPuppeteerConfigFileName}' does not contain
         puppeteer options that are valid for use in mscgenjs-cli.

         These options you can use:
         - args (an array of options)
         - devtools (boolean)
         - executablePath (path to an executable)
         - headless (boolean)
         - slowMo (delay in ms)
         - timeout (in ms)\n\n`);
    }
    return lPuppeteerConfigObject;
}
exports.validOutputTypeRE = VALID_OUTPUT_TYPES.join("|");
exports.validInputTypeRE = mscgenjs
    .getAllowedValues()
    .inputType.map((pValue) => pValue.name)
    .join("|");
exports.validNamedStyleRE = mscgenjs
    .getAllowedValues()
    .namedStyle.filter((pValue) => pValue.experimental === false && pValue.deprecated === false)
    .map((pValue) => pValue.name)
    .join("|");
exports.validVerticalAlignmentRE = mscgenjs
    .getAllowedValues()
    .regularArcTextVerticalAlignment.map((pValue) => pValue.name)
    .join("|");
