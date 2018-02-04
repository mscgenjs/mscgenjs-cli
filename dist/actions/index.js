"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mscgenjs_1 = require("mscgenjs");
const pify = require("pify");
const fileNameToStream_1 = require("./fileNameToStream");
const readFromStream_1 = require("./readFromStream");
const render_1 = require("./render");
const translate = pify(mscgenjs_1.translateMsc);
function isGraphicsOutput(pOutputType) {
    const GRAPHICSFORMATS = ["svg", "png", "jpeg"];
    return GRAPHICSFORMATS.includes(pOutputType);
}
function getAST(pInput, pOptions) {
    return translate(pInput, {
        inputType: pOptions.inputType,
        outputType: "json",
    });
}
function render(pOptions) {
    return readFromStream_1.readFromStream(fileNameToStream_1.getInStream(pOptions.inputFrom))
        .then((pInput) => getAST(pInput, pOptions))
        .then((pAST) => render_1.renderTheShizzle(pAST, pOptions));
}
function transpile(pOptions) {
    return readFromStream_1.readFromStream(fileNameToStream_1.getInStream(pOptions.inputFrom))
        .then((pInput) => translate(pInput, pOptions));
}
function transform(pOptions) {
    if (isGraphicsOutput(pOptions.outputType)) {
        return render(pOptions)
            .then((pResult) => fileNameToStream_1.getOutStream(pOptions.outputTo).write(pResult));
    }
    else {
        return transpile(pOptions)
            .then((pResult) => fileNameToStream_1.getOutStream(pOptions.outputTo).write(pResult));
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
