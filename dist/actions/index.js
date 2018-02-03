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
