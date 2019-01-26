import { InputType, RegularArcTextVerticalAlignmentType } from "mscgenjs";

export type NamedStyleType = "basic" | "lazy" | "classic" | "fountainpen";

export type GraphicalOutputType = "svg" | "png" | "jpeg";

export type TextOutputType =
  | "mscgen"
  | "msgenny"
  | "xu"
  | "json"
  | "dot"
  | "doxygen";

export interface IPuppeteerOptions {
  args?: string[];
  devtools?: boolean;
  executablePath?: string;
  headless: boolean;
  slowMo?: number;
  timeout?: number;
}

export type OutputType = GraphicalOutputType | TextOutputType;

export interface IOptions {
  inputFrom: string;
  outputTo?: string;
  inputType?: InputType;
  outputType?: OutputType;
  namedStyle?: NamedStyleType;
  mirrorEntities?: boolean;
  verticalAlignment?: RegularArcTextVerticalAlignmentType;
}

export interface INormalizedOptions {
  inputFrom: string;
  outputTo: string;
  inputType: InputType;
  outputType: OutputType;
  namedStyle: NamedStyleType;
  mirrorEntities: boolean;
  regularArcTextVerticalAlignment: RegularArcTextVerticalAlignmentType;
  puppeteerOptions: IPuppeteerOptions;
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
