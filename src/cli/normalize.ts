"use strict";

import * as path from "path";
import { INormalizedOptions, OutputType } from "../types";
import { InputType } from "mscgenjs";
import { CommandOptions } from "commander";

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
function classifyExtension(
  pString: string | undefined,
  pExtensionMap: any,
  pDefault: string
): string {
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

function deriveOutputFromInput(
  pInputFrom: string,
  pOutputType: OutputType
): string {
  if (!pInputFrom || "-" === pInputFrom) {
    return "-";
  }
  return path
    .join(
      path.dirname(pInputFrom),
      path.basename(pInputFrom, path.extname(pInputFrom))
    )
    .concat(".")
    .concat(pOutputType);
}

function determineOutputTo(
  pOutputTo: string | undefined,
  pInputFrom: string,
  pOutputType: OutputType
): string {
  return Boolean(pOutputTo)
    ? (pOutputTo as string)
    : deriveOutputFromInput(pInputFrom, pOutputType);
}

function determineInputType(
  pInputType: string | undefined,
  pInputFrom: string
): InputType {
  if (pInputType) {
    return (pInputType === "ast" ? "json" : pInputType) as InputType;
  }
  return classifyExtension(pInputFrom, INPUT_EXTENSIONS, "mscgen") as InputType;
}

function determineOutputType(
  pOutputType: string | undefined,
  pOutputTo: string | undefined,
  pParserOutput: string
): OutputType {
  if (Boolean(pParserOutput)) {
    return "json";
  }
  if (Boolean(pOutputType)) {
    return pOutputType === "ast" ? "json" : (pOutputType as OutputType);
  }
  if (Boolean(pOutputTo)) {
    return classifyExtension(pOutputTo, OUTPUT_EXTENSIONS, "svg") as OutputType;
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

function isKnownCLIOption(pCandidateString: string) {
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
function ejectNonCLIOptions(pOptions: any): INormalizedOptions {
  return Object.keys(pOptions)
    .filter(isKnownCLIOption)
    .reduce((pAll: any, pKey: string) => {
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
export default function normalize(
  pArgument: string,
  pOptions: any
): INormalizedOptions {
  const lReturnValue = ejectNonCLIOptions(pOptions);

  lReturnValue.inputFrom = Boolean(pArgument)
    ? pArgument
    : lReturnValue.inputFrom;
  lReturnValue.inputType = determineInputType(
    lReturnValue.inputType,
    lReturnValue.inputFrom
  );
  lReturnValue.outputType = determineOutputType(
    lReturnValue.outputType,
    lReturnValue.outputTo,
    pOptions.parserOutput
  );
  lReturnValue.outputTo = determineOutputTo(
    lReturnValue.outputTo,
    lReturnValue.inputFrom,
    lReturnValue.outputType
  );
  lReturnValue.regularArcTextVerticalAlignment =
    pOptions.verticalAlignment || "middle";

  return lReturnValue;
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
