"use strict";
import Ajv from "ajv";
import * as fs from "fs";
import * as mscgenjs from "mscgenjs";
import {
  INormalizedOptions,
  IPuppeteerOptions,
  NamedStyleType,
  OutputType,
} from "../types";
/* tslint:disable-next-line */
const puppeteerOptionsSchema = require("./puppeteer-options.schema.json");

const VALID_GRAPHICS_TYPES = Object.freeze(["svg", "png", "jpeg"]);
const VALID_OUTPUT_TYPES = VALID_GRAPHICS_TYPES.concat(
  mscgenjs.getAllowedValues().outputType.map((pValue) => pValue.name)
);
const ajv = new Ajv();

function isStdout(pFilename: string): boolean {
  return "-" === pFilename;
}

function fileExists(pFilename: string): boolean {
  try {
    if (!isStdout(pFilename)) {
      fs.accessSync(pFilename, fs.constants.R_OK);
    }
    return true;
  } catch (e: any) {
    return false;
  }
}

function getValidValues(pAttribute: string): string {
  return (mscgenjs.getAllowedValues() as any)[pAttribute]
    .filter((pValue: mscgenjs.IValueDetails) => pValue.experimental === false)
    .map((pValue: mscgenjs.IValueDetails) => pValue.name)
    .join(", ");
}

function isValidValue(pAttribute: string, pCandidateValue: string): boolean {
  return (mscgenjs.getAllowedValues() as any)[pAttribute].some(
    (pValue: mscgenjs.IValueDetails) => pValue.name === pCandidateValue
  );
}

export function validOutputType(pType: OutputType): OutputType {
  if (VALID_OUTPUT_TYPES.some((pName) => pName === pType)) {
    return pType;
  }

  throw Error(
    `\n  error: '${pType}' is not a valid output type. mscgen_js can emit:` +
      `\n          - the grapics formats svg, jpeg and png` +
      `\n          - the text formats dot, doxygen, mscgen, msgenny, xu and json.\n\n`
  );
}

export function validInputType(pType: string): string {
  if (isValidValue("inputType", pType)) {
    return pType as mscgenjs.InputType;
  }

  throw Error(
    `\n  error: '${pType}' is not a valid input type.` +
      `\n         mscgen_js can read ${getValidValues("inputType")}\n\n`
  );
}

export function validNamedStyle(pStyle: NamedStyleType): NamedStyleType {
  if (isValidValue("namedStyle", pStyle)) {
    return pStyle as NamedStyleType;
  }

  throw Error(
    `\n  error: '${pStyle}' is not a recognized named style.` +
      `\n         You can use one of these: ${getValidValues("namedStyle")}\n\n`
  );
}

export function validVerticalAlignment(
  pAlignment: string
): mscgenjs.RegularArcTextVerticalAlignmentType {
  if (isValidValue("regularArcTextVerticalAlignment", pAlignment)) {
    return pAlignment as mscgenjs.RegularArcTextVerticalAlignmentType;
  }

  throw Error(
    `\n  error: '${pAlignment}' is not a recognized vertical alignment.` +
      `\n         You can use one of these: ${getValidValues(
        "regularArcTextVerticalAlignment"
      )}\n\n`
  );
}

export function validateArguments(
  pOptions: INormalizedOptions
): Promise<INormalizedOptions> {
  return new Promise((pResolve, pReject) => {
    if (!pOptions.inputFrom) {
      pReject(Error(`\n  error: Please specify an input file.\n\n`));
    }

    if (!pOptions.outputTo) {
      pReject(Error(`\n  error: Please specify an output file.\n\n`));
    }

    if (!fileExists(pOptions.inputFrom)) {
      pReject(
        Error(
          `\n  error: Failed to open input file '${pOptions.inputFrom}'\n\n`
        )
      );
    }

    pResolve(pOptions);
  });
}

export function validPuppeteerOptions(
  pPuppeteerConfigFileName: string
): IPuppeteerOptions {
  let lPuppeteerConfigFileContents = "";
  let lPuppeteerConfigObject = {};

  try {
    lPuppeteerConfigFileContents = fs.readFileSync(
      pPuppeteerConfigFileName,
      "utf8"
    );
  } catch (pException) {
    throw Error(
      `\n  error: Failed to open puppeteer options configuration file '${pPuppeteerConfigFileName}'\n\n`
    );
  }

  try {
    lPuppeteerConfigObject = JSON.parse(lPuppeteerConfigFileContents);
  } catch (pException) {
    throw Error(
      `\n  error: '${pPuppeteerConfigFileName}' does not contain valid JSON\n\n`
    );
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

  return lPuppeteerConfigObject as IPuppeteerOptions;
}

export const validOutputTypeRE = VALID_OUTPUT_TYPES.join("|");

export const validInputTypeRE = mscgenjs
  .getAllowedValues()
  .inputType.map((pValue) => pValue.name)
  .join("|");

export const validNamedStyleRE = mscgenjs
  .getAllowedValues()
  .namedStyle.filter(
    (pValue) => pValue.experimental === false && pValue.deprecated === false
  )
  .map((pValue) => pValue.name)
  .join("|");

export const validVerticalAlignmentRE = mscgenjs
  .getAllowedValues()
  .regularArcTextVerticalAlignment.map((pValue) => pValue.name)
  .join("|");

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
