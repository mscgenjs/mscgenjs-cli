import * as getStream from "get-stream";
import { get as _get } from "lodash";
import { ITranslateOptions, translateMsc } from "mscgenjs";
import { INormalizedOptions, OutputType } from "../types";
import { getInStream, getOutStream } from "./fileNameToStream";
import { renderWithChromeHeadless } from "./render";

function isGraphicsOutput(pOutputType: OutputType) {
  const GRAPHICSFORMATS = ["svg", "png", "jpeg"];
  return GRAPHICSFORMATS.includes(pOutputType);
}

function getAST(pInput: string, pOptions: INormalizedOptions): string {
  return translateMsc(pInput, {
    inputType: pOptions.inputType,
    outputType: "ast",
  });
}

export function removeAutoWidth(pAST: any, pOutputType: OutputType) {
  if (
    (pOutputType === "png" || pOutputType === "jpeg") &&
    _get(pAST, "options.width", "not-auto") === "auto"
  ) {
    delete pAST.options.width;
  }
  return pAST;
}

function render(pOptions: INormalizedOptions): Promise<any> {
  return getStream(getInStream(pOptions.inputFrom))
    .then((pInput) => getAST(pInput, pOptions))
    .then((pAST) =>
      renderWithChromeHeadless(
        removeAutoWidth(pAST, pOptions.outputType),
        pOptions
      )
    );
}

function transpile(pOptions: INormalizedOptions): Promise<string> {
  return getStream(getInStream(pOptions.inputFrom)).then((pInput) =>
    translateMsc(pInput, pOptions as ITranslateOptions)
  );
}

export function transform(pOptions: INormalizedOptions): Promise<boolean> {
  if (isGraphicsOutput(pOptions.outputType)) {
    return render(pOptions).then((pResult) =>
      getOutStream(pOptions.outputTo).write(pResult)
    );
  } else {
    return transpile(pOptions).then((pResult) =>
      getOutStream(pOptions.outputTo).write(pResult, "utf8")
    );
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
