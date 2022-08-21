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
        return "-";
    }
    return path
        .join(path.dirname(pInputFrom), path.basename(pInputFrom, path.extname(pInputFrom)))
        .concat(".")
        .concat(pOutputType);
}
function determineOutputTo(pOutputTo, pInputFrom, pOutputType) {
    return Boolean(pOutputTo)
        ? pOutputTo
        : deriveOutputFromInput(pInputFrom, pOutputType);
}
function determineInputType(pInputType, pInputFrom) {
    if (pInputType) {
        return (pInputType === "ast" ? "json" : pInputType);
    }
    return classifyExtension(pInputFrom, INPUT_EXTENSIONS, "mscgen");
}
function determineOutputType(pOutputType, pOutputTo, pParserOutput) {
    if (Boolean(pParserOutput)) {
        return "json";
    }
    if (Boolean(pOutputType)) {
        return pOutputType === "ast" ? "json" : pOutputType;
    }
    if (Boolean(pOutputTo)) {
        return classifyExtension(pOutputTo, OUTPUT_EXTENSIONS, "svg");
    }
    return "svg";
}
const KNOWN_CLI_OPTIONS = [
    "inputFrom",
    "outputTo",
    "inputType",
    "outputType",
    "namedStyle",
    "mirrorEntities",
    "parserOutput",
    "regularArcTextVerticalAlignment",
    "puppeteerOptions",
];
function isKnownCLIOption(pCandidateString) {
    return KNOWN_CLI_OPTIONS.includes(pCandidateString);
}
/**
 * Remove all attributes from the input object (which'd typically be
 * originating from commander) that are not functional mscgenjs-cli
 * options so a clean object can be passed through to the main function
 *
 * @param {any} pOptions - an options object e.g. as output from commander
 * @returns {INormalizedOptions} - an options object that only contains stuff we care about
 */
function ejectNonCLIOptions(pOptions) {
    return Object.keys(pOptions)
        .filter(isKnownCLIOption)
        .reduce((pAll, pKey) => {
        pAll[pKey] = pOptions[pKey];
        return pAll;
    }, {});
}
/**
 * transforms the given argument and options to a uniform format
 *
 * - guesses the input type when not given
 * - guesses the output type when not given
 * - guesses the filename to output to when not given
 * - translates parserOutput to a regular output type
 *
 * @param  {string} pArgument an argument (containing the filename to parse)
 * @param  {any} pOptions a commander options object
 * @return {any} a commander options object with options 'normalized'
 */
function normalize(pArgument, pOptions) {
    const lReturnValue = ejectNonCLIOptions(pOptions);
    lReturnValue.inputFrom = Boolean(pArgument)
        ? pArgument
        : lReturnValue.inputFrom;
    lReturnValue.inputType = determineInputType(lReturnValue.inputType, lReturnValue.inputFrom);
    lReturnValue.outputType = determineOutputType(lReturnValue.outputType, lReturnValue.outputTo, pOptions.parserOutput);
    lReturnValue.outputTo = determineOutputTo(lReturnValue.outputTo, lReturnValue.inputFrom, lReturnValue.outputType);
    lReturnValue.regularArcTextVerticalAlignment =
        pOptions.verticalAlignment || "middle";
    return lReturnValue;
}
exports.default = normalize;
