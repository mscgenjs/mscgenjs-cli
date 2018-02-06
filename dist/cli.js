/* tslint no-var-requires:0 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const actions = require("./actions");
const formatError = require("./actions/formatError");
const showLicense = require("./actions/showLicense");
const normalizations = require("./normalizations");
const validations = require("./validations");
function presentError(e) {
    process.stderr.write(formatError(e) + "\n");
    process.exit(1);
}
try {
    program
        .version(require("../package.json").version)
        .option("-T --output-type <type>", validations.validOutputTypeRE, validations.validOutputType).option("-I --input-type <type>", validations.validInputTypeRE, validations.validInputType).option("-i --input-from <file>", "File to read from. use - for stdin.").option("-o --output-to <file>", "File to write to. use - for stdout.").option("-p --parser-output", "Print parsed msc output").option("-s --css <string>", "Additional styles to use. Experimental!").option("-n --named-style <style>", validations.validNamedStyleRE, validations.validNamedStyle).option("-m --mirror-entities", "Repeat the entities on the chart's bottom").option("-v --vertical-alignment <alignment>", `Vertical alignment of labels on regular arcs. Experimental!
                                     ${validations.validVerticalAlignmentRE} (default middle)`, validations.validVerticalAlignment, "middle").option("-l --license", "Display license and exit", () => {
        process.stdout.write(showLicense());
        process.exit(0);
    }).arguments("[infile]").parse(process.argv);
    validations
        .validateArguments(normalizations.normalize(program.args[0], program))
        .then(actions.transform)
        .catch(presentError);
}
catch (pError) {
    presentError(pError);
}
