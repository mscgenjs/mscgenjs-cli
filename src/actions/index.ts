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
            .then((pResult) => getOutStream(pOptions.outputTo).write(pResult, "utf8"));
    }
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
