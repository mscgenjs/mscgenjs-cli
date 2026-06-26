"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const actions = __importStar(require("../actions/index.js"));
const formatError_js_1 = __importDefault(require("../actions/formatError.js"));
const showLicense_js_1 = __importDefault(require("../actions/showLicense.js"));
const normalize_js_1 = __importDefault(require("./normalize.js"));
const validations = __importStar(require("./validations.js"));
const $package = require("../../package.json");
// Hardcoded help text matching the documented CLI interface exactly.
// Kept as a constant rather than generated dynamically so the output
// is stable and not accidentally affected by upstream mscgenjs changes.
const HELP_TEXT = `Usage: mscgen_js [options] [infile]

Options:
  -T --output-type <type>          svg|png|jpeg|mscgen|msgenny|xu|json|ast|dot|doxygen
  -I --input-type <type>           mscgen|msgenny|xu|json|ast
  -i --input-from <file>           File to read from. use - for stdin.
  -o --output-to <file>            File to write to. use - for stdout.
  -p --parser-output               Print parsed msc output
  -s --css <string>                Additional styles to use. Experimental
  -n --named-style <style>         basic|lazy|classic|noentityboxes
  -m --mirror-entities             Repeat the entities on the chart's
                                   bottom
  -v --vertical-alignment <align>  Vertical alignment of labels on regular
                                   arcs. Experimental
                                   above|middle|below (default: "middle")
  --puppeteer-options <file>       (advanced) pass puppeteer launch options
                                   see README.md for details
  -l --license                     Display license and exit
  -V, --version                    output the version number
  -h, --help                       display help for command
`;
function presentError(e) {
    process.stderr.write((0, formatError_js_1.default)(e) + "\n");
    process.exit(1);
}
try {
    // parseArgs (node:util, stable since Node 18.11) replaces commander.
    // allowPositionals lets the optional [infile] argument land in `positionals`.
    const { values, positionals } = (0, node_util_1.parseArgs)({
        args: process.argv.slice(2),
        allowPositionals: true,
        options: {
            "output-type": { type: "string", short: "T" },
            "input-type": { type: "string", short: "I" },
            "input-from": { type: "string", short: "i" },
            "output-to": { type: "string", short: "o" },
            "parser-output": { type: "boolean", short: "p" },
            "css": { type: "string", short: "s" },
            "named-style": { type: "string", short: "n" },
            "mirror-entities": { type: "boolean", short: "m" },
            "vertical-alignment": { type: "string", short: "v" },
            "puppeteer-options": { type: "string" },
            "license": { type: "boolean", short: "l" },
            "version": { type: "boolean", short: "V" },
            "help": { type: "boolean", short: "h" },
        },
    });
    // Handle meta-options that short-circuit normal processing
    if (values.help) {
        process.stdout.write(HELP_TEXT);
        process.exit(0);
    }
    if (values.version) {
        process.stdout.write(`${$package.version}\n`);
        process.exit(0);
    }
    if (values.license) {
        process.stdout.write((0, showLicense_js_1.default)());
        process.exit(0);
    }
    // Validate option values; each function throws a descriptive Error on
    // invalid input, which is caught by the outer try/catch → presentError.
    if (values["output-type"]) {
        validations.validOutputType(values["output-type"]);
    }
    if (values["input-type"]) {
        validations.validInputType(values["input-type"]);
    }
    if (values["named-style"]) {
        validations.validNamedStyle(values["named-style"]);
    }
    if (values["vertical-alignment"]) {
        validations.validVerticalAlignment(values["vertical-alignment"]);
    }
    // validPuppeteerOptions reads + schema-validates the file; throws on error.
    const lPuppeteerOptions = values["puppeteer-options"]
        ? validations.validPuppeteerOptions(values["puppeteer-options"])
        : undefined;
    // Map kebab-case parseArgs keys to the camelCase shape that normalize()
    // and ejectNonCLIOptions() expect.  css is intentionally included even
    // though normalize currently filters it out, preserving parity with the
    // previous commander implementation.
    const lOptions = {
        inputFrom: values["input-from"],
        outputTo: values["output-to"],
        inputType: values["input-type"],
        outputType: values["output-type"],
        namedStyle: values["named-style"],
        mirrorEntities: values["mirror-entities"],
        parserOutput: values["parser-output"],
        verticalAlignment: values["vertical-alignment"],
        puppeteerOptions: lPuppeteerOptions,
        css: values["css"],
    };
    validations
        .validateArguments((0, normalize_js_1.default)(positionals[0], lOptions))
        .then(actions.transform)
        .catch(presentError);
}
catch (pError) {
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
