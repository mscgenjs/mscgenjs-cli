import { translateMsc } from "mscgenjs";
import * as pify from "pify";
import { INormalizedOptions, OutputType } from "../types";
import { getInStream, getOutStream } from "./fileNameToStream";
import { readFromStream } from "./readFromStream";
import { renderTheShizzle } from "./render";

const translate = pify(translateMsc);

function isGraphicsOutput(pOutputType: OutputType) {
    const GRAPHICSFORMATS = ["svg", "png", "jpeg"];
    return GRAPHICSFORMATS.includes(pOutputType);
}

function getAST(pInput: string, pOptions: INormalizedOptions): Promise<string> {
    return translate(
        pInput,
        {
            inputType: pOptions.inputType,
            outputType: "json",
        },
    );
}

function render(pOptions: INormalizedOptions): Promise<any> {
    return readFromStream(getInStream(pOptions.inputFrom))
        .then((pInput) => getAST(pInput, pOptions))
        .then((pAST) => renderTheShizzle(pAST, pOptions));
}

function transpile(pOptions: INormalizedOptions): Promise<string> {
    return readFromStream(getInStream(pOptions.inputFrom))
        .then((pInput) => translate(pInput, pOptions));
}

export function transform(pOptions: INormalizedOptions): Promise<boolean> {
    if (isGraphicsOutput(pOptions.outputType)) {
        return render(pOptions)
            .then((pResult) => getOutStream(pOptions.outputTo).write(pResult));
    } else {
        return transpile(pOptions)
            .then((pResult) => getOutStream(pOptions.outputTo).write(pResult));
    }
}
