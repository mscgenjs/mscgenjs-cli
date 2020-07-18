/* tslint no-var-requires:0 */
"use strict";
import * as program from "commander";
import * as semver from "semver";
import * as actions from "../actions";
import formatError = require("../actions/formatError");
import showLicense = require("../actions/showLicense");
import normalize from "./normalize";
import * as validations from "./validations";
import { OutputType, NamedStyleType } from "../types";

// tslint:disable-next-line:no-var-requires
const $package = require("../../package.json");

function presentError(e: Error) {
  process.stderr.write(formatError(e) + "\n");
  process.exit(1);
}

/* istanbul ignore if  */
if (!semver.satisfies(process.versions.node, $package.engines.node)) {
  process.stderr.write(
    `\nERROR: your node version (${process.versions.node}) is not recent enough.\n`
  );
  process.stderr.write(
    `       ${$package.name} needs a version of node ${$package.engines.node}\n\n`
  );

  /* eslint no-process-exit: 0 */
  process.exit(1);
}

try {
  program
    .option(
      "-T --output-type <type>",
      validations.validOutputTypeRE,
      (pOutputType) =>
        validations.validOutputType(pOutputType as OutputType) as string
    )
    .option(
      "-I --input-type <type>",
      validations.validInputTypeRE,
      validations.validInputType
    )
    .option("-i --input-from <file>", "File to read from. use - for stdin.")
    .option("-o --output-to <file>", "File to write to. use - for stdout.")
    .option("-p --parser-output", "Print parsed msc output")
    .option("-s --css <string>", "Additional styles to use. Experimental")
    .option(
      "-n --named-style <style>",
      validations.validNamedStyleRE,
      (pNamedStyle) =>
        validations.validNamedStyle(pNamedStyle as NamedStyleType) as string
    )
    .option(
      "-m --mirror-entities",
      `Repeat the entities on the chart's
                                 bottom`
    )
    .option(
      "-v --vertical-alignment <align>",
      `Vertical alignment of labels on regular
                                 arcs. Experimental
                                 ${validations.validVerticalAlignmentRE}`,
      validations.validVerticalAlignment,
      "middle"
    )
    .option(
      "--puppeteer-options <file>",
      `(advanced) pass puppeteer launch options
                                 see README.md for details`,
      validations.validPuppeteerOptions
    )
    .option("-l --license", "Display license and exit", () => {
      process.stdout.write(showLicense());
      process.exit(0);
    })
    .version($package.version)
    .arguments("[infile]")
    .parse(process.argv);
  validations
    .validateArguments(normalize(program.args[0], program))
    .then(actions.transform)
    .catch(presentError);
} catch (pError) {
  presentError(pError);
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
