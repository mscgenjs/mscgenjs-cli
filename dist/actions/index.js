"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getStream = require("get-stream");
const lodash_1 = require("lodash");
const mscgenjs_1 = require("mscgenjs");
const fileNameToStream_1 = require("./fileNameToStream");
const render_1 = require("./render");
function isGraphicsOutput(pOutputType) {
    const GRAPHICSFORMATS = ["svg", "png", "jpeg"];
    return GRAPHICSFORMATS.includes(pOutputType);
}
function getAST(pInput, pOptions) {
    return mscgenjs_1.translateMsc(pInput, {
        inputType: pOptions.inputType,
        outputType: "ast",
    });
}
function removeAutoWidth(pAST, pOutputType) {
    if ((pOutputType === "png" || pOutputType === "jpeg") &&
        lodash_1.get(pAST, "options.width", "not-auto") === "auto") {
        delete pAST.options.width;
    }
    return pAST;
}
exports.removeAutoWidth = removeAutoWidth;
function render(pOptions) {
    return getStream(fileNameToStream_1.getInStream(pOptions.inputFrom))
        .then((pInput) => getAST(pInput, pOptions))
        .then((pAST) => render_1.renderWithChromeHeadless(removeAutoWidth(pAST, pOptions.outputType), pOptions));
}
function transpile(pOptions) {
    return getStream(fileNameToStream_1.getInStream(pOptions.inputFrom)).then((pInput) => mscgenjs_1.translateMsc(pInput, pOptions));
}
function transform(pOptions) {
    if (isGraphicsOutput(pOptions.outputType)) {
        return render(pOptions).then((pResult) => fileNameToStream_1.getOutStream(pOptions.outputTo).write(pResult));
    }
    else {
        return transpile(pOptions).then((pResult) => fileNameToStream_1.getOutStream(pOptions.outputTo).write(pResult, "utf8"));
    }
}
exports.transform = transform;
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
