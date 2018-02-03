import { InputType, RegularArcTextVerticalAlignmentType } from "mscgenjs";

export type NamedStyleType =
    "basic"      |
    "lazy"       |
    "classic"    |
    "fountainpen"
;

export type GraphicalOutputType =
    "svg"  |
    "png"  |
    "jpeg"
;

export type TextOutputType =
    "mscgen"  |
    "msgenny" |
    "xu"      |
    "json"    |
    "dot"     |
    "doxygen"
;

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
}

// export {RegularArcTextVerticalAlignmentType, InputType};
