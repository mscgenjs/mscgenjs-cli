"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const INPUT_EXTENSIONS = Object.freeze({
    ast: "json",
    json: "json",
    msc: "mscgen",
    mscgen: "mscgen",
    mscin: "mscgen",
    msgenny: "msgenny",
    seq: "mscgen",
    xu: "xu",
});
const OUTPUT_EXTENSIONS = Object.freeze({
    ast: "json",
    dot: "dot",
    doxygen: "doxygen",
    jpeg: "jpeg",
    jpg: "jpeg",
    json: "json",
    msc: "mscgen",
    mscgen: "mscgen",
    mscin: "mscgen",
    msgenny: "msgenny",
    png: "png",
    seq: "mscgen",
    svg: "svg",
    xu: "xu",
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
function classifyExtension(pString, pExtensionMap, pDefault) {
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
function deriveOutputFromInput(pInputFrom, pOutputType) {
    if (!pInputFrom || "-" === pInputFrom) {
        return;
    }
    return path.join(path.dirname(pInputFrom), path.basename(pInputFrom, path.extname(pInputFrom))).concat(".").concat(pOutputType);
}
function determineOutputTo(pOutputTo, pInputFrom, pOutputType) {
    return Boolean(pOutputTo) ? pOutputTo : deriveOutputFromInput(pInputFrom, pOutputType);
}
function determineInputType(pInputType, pInputFrom) {
    if (pInputType) {
        return pInputType === "ast" ? "json" : pInputType;
    }
    return classifyExtension(pInputFrom, INPUT_EXTENSIONS, "mscgen");
}
function determineOutputType(pOutputType, pOutputTo, pParserOutput) {
    if (Boolean(pParserOutput)) {
        return "json";
    }
    if (Boolean(pOutputType)) {
        return pOutputType;
    }
    if (Boolean(pOutputTo)) {
        return classifyExtension(pOutputTo, OUTPUT_EXTENSIONS, "svg");
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
function normalize(pArgument, pOptions) {
    const lRetval = JSON.parse(JSON.stringify(pOptions));
    lRetval.inputFrom = Boolean(pArgument) ? pArgument : pOptions.inputFrom;
    lRetval.inputType =
        determineInputType(pOptions.inputType, lRetval.inputFrom);
    lRetval.outputType =
        determineOutputType(pOptions.outputType, pOptions.outputTo, pOptions.parserOutput);
    lRetval.outputTo =
        determineOutputTo(pOptions.outputTo, lRetval.inputFrom, lRetval.outputType);
    lRetval.regularArcTextVerticalAlignment = pOptions.verticalAlignment || "middle";
    return lRetval;
}
exports.normalize = normalize;
