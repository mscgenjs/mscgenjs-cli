/* eslint no-process-exit:0 */
"use strict";

const program        = require("commander");
const validations    = require("./validations");
const actions        = require("./actions");

function presentError(e) {
    process.stderr.write(actions.formatError(e));
    process.exit(1);
}

try {
    program
        .version(require("../package.json").version)
        .option(
            "-T --output-type <type>",
            validations.validOutputTypeRE,
            validations.validOutputType
        ).option(
            "-I --input-type <type>",
            validations.validInputTypeRE,
            validations.validInputType
        ).option(
            "-i --input-from <file>",
            "File to read from. use - for stdin."
        ).option(
            "-o --output-to <file>",
            "File to write to. use - for stdout."
        ).option(
            "-p --parser-output",
            "Print parsed msc output"
        ).option(
            "-s --css <string>",
            "Additional styles to use. Experimental!"
        ).option(
            "-n --named-style <style>",
            validations.validNamedStyleRE,
            validations.validNamedStyle
        ).option(
            "-m --mirror-entities",
            "Repeat the entities on the chart's bottom"
        ).option(
            "-v --vertical-alignment <alignment>",
            `Vertical alignment of labels on regular arcs. Experimental!
                                     ${validations.validVerticalAlignmentRE} (default middle)`,
            validations.validVerticalAlignment,
            "middle"
        ).option(
            "-l --license",
            "Display license and exit",
            () => {
                process.stdout.write(actions.LICENSE);
                process.exit(0);
            }
        ).arguments(
            "[infile]"
        ).parse(
            process.argv
        );
    validations.validateArguments(
        require("./normalizations").normalize(program.args[0], program)
    )
        .then(actions.transform)
        .catch(presentError);
} catch (e) {
    presentError(e);
}

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
