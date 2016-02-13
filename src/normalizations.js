/* jshint node:true */
"use strict";

module.exports = (() => {
    const path = require("path");

    const INPUT_EXTENSIONS = {
        "msgenny" : "msgenny",
        "mscgen"  : "mscgen",
        "msc"     : "mscgen",
        "seq"     : "mscgen",
        "mscin"   : "mscgen",
        "xu"      : "xu",
        "json"    : "json",
        "ast"     : "json"
    };
    const OUTPUT_EXTENSIONS = {
        "msgenny" : "msgenny",
        "mscgen"  : "mscgen",
        "msc"     : "mscgen",
        "seq"     : "mscgen",
        "mscin"   : "mscgen",
        "xu"      : "xu",
        "json"    : "json",
        "ast"     : "json",
        "svg"     : "svg",
        "png"     : "png",
        "jpg"     : "jpeg",
        "jpeg"    : "jpeg",
        "dot"     : "dot",
        "doxygen" : "doxygen"
    };

    /**
     * Given a filename in pString, returns what language is probably
     * contained in that file, judging from the extension (the last dot
     * in the string to end-of-string)
     *
     * When in doubt returns pDefault
     *
     * @param {string} pString
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

        let lPos = pString.lastIndexOf(".");
        if (lPos > -1) {
            let lExt = pString.slice(lPos + 1);
            if (pExtensionMap[lExt]) {
                return pExtensionMap[lExt];
            }
        }

        return pDefault;
    }

    function deriveOutputFromInput(pInputFrom, pOutputType){
        if (!pInputFrom || '-' === pInputFrom){
            return undefined;
        }
        return path.join(
                    path.dirname(pInputFrom),
                    path.basename(pInputFrom, path.extname(pInputFrom))
                ) .concat('.').concat(pOutputType);
    }

    function determineOutputTo(pOutputTo, pInputFrom, pOutputType){
        return !!pOutputTo ? pOutputTo : deriveOutputFromInput(pInputFrom, pOutputType);
    }

    function determineInputType (pInputType, pInputFrom){
        if (pInputType) {
            return pInputType === 'ast' ? 'json': pInputType;
        }
        return classifyExtension(pInputFrom, INPUT_EXTENSIONS, "mscgen");
    }

    function determineOutputType(pOutputType, pOutputTo, pParserOutput){
        if (!!pParserOutput) {
            return "json";
        }
        if (!!pOutputType) {
            return pOutputType;
        }
        if(!!pOutputTo) {
            return classifyExtension(pOutputTo, OUTPUT_EXTENSIONS, "svg");
        }
        return "svg";
    }

    return {
        /**
         * transforms the given argument and options to a uniform format
         *
         * - guesses the input type when not given
         * - guesses the output type when not given
         * - gueses the filename to output to when not given
         * - translates parserOutput to a regular output type
         *
         * @param  {string} pArgument
         * @param  {object} pOptions a commander options object
         * @return {object} a commander options object with options 'normalized'
         */
        normalize (pArgument, pOptions) {
            let lRetval = JSON.parse(JSON.stringify(pOptions));

            lRetval.inputFrom  = !!pArgument ? pArgument : pOptions.inputFrom;
            lRetval.inputType  =
                determineInputType(
                    pOptions.inputType,
                    lRetval.inputFrom
                );
            lRetval.outputType =
                determineOutputType(
                    pOptions.outputType,
                    pOptions.outputTo,
                    pOptions.parserOutput
                );
            lRetval.outputTo   =
                determineOutputTo(
                    pOptions.outputTo,
                    lRetval.inputFrom,
                    lRetval.outputType
                );
            return lRetval;
        }
    };
})();
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
