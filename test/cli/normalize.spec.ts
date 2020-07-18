import { expect } from "chai";
import { CommanderStatic } from "commander";
import normalize from "../../src/cli/normalize";

const TESTPAIRS = [
  {
    title: "leaves a fully specified program alone",
    input: {
      options: {
        inputFrom: "input.xu",
        inputType: "msgenny",
        outputTo: "output.svg",
        outputType: "mscgen",
      },
    },
    expected: {
      options: {
        inputFrom: "input.xu",
        inputType: "msgenny",
        outputTo: "output.svg",
        outputType: "mscgen",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "guesses the input type, takes a default for the output type",
    input: {
      options: {
        inputFrom: "input.xu",
        outputTo: "output.svg",
      },
    },
    expected: {
      options: {
        inputFrom: "input.xu",
        inputType: "xu",
        outputTo: "output.svg",
        outputType: "svg",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "if parser-output is specified take sets outputType to 'json'",
    input: {
      options: {
        inputFrom: "w00tchart.mscin",
        parserOutput: true,
      },
    },
    expected: {
      options: {
        inputFrom: "w00tchart.mscin",
        inputType: "mscgen",
        outputType: "json",
        outputTo: "w00tchart.json",
        parserOutput: true,
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "guesses the output type from a given filename",
    input: {
      options: {
        inputFrom: "w00tchart.seq",
        outputTo: "a nice file.notanextension.png",
      },
    },
    expected: {
      options: {
        inputFrom: "w00tchart.seq",
        inputType: "mscgen",
        outputType: "png",
        outputTo: "a nice file.notanextension.png",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "cannot guess the input type when it is stdin, so takes a default",
    input: {
      options: {
        inputFrom: "-",
        outputTo: "output.svg",
      },
    },
    expected: {
      options: {
        inputFrom: "-",
        inputType: "mscgen",
        outputTo: "output.svg",
        outputType: "svg",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "treats .ast as .json",
    input: {
      options: {
        inputFrom: "achoo.ast",
      },
    },
    expected: {
      options: {
        inputFrom: "achoo.ast",
        inputType: "json",
        outputTo: "achoo.svg",
        outputType: "svg",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title:
      "treats .ast as .json - even wen explicitly stated in options.inputType",
    input: {
      options: {
        inputFrom: "achoo.interestingextension",
        inputType: "ast",
      },
    },
    expected: {
      options: {
        inputFrom: "achoo.interestingextension",
        inputType: "json",
        outputTo: "achoo.svg",
        outputType: "svg",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "can't guess outputTo when inputFrom is stdin",
    input: {
      options: {
        inputFrom: "-",
      },
    },
    expected: {
      options: {
        inputFrom: "-",
        inputType: "mscgen",
        outputTo: "-",
        outputType: "svg",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "can't guess outputTo when inputFrom is not there",
    input: {
      options: {},
    },
    expected: {
      options: {
        inputFrom: undefined,
        inputType: "mscgen",
        outputTo: "-",
        outputType: "svg",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "migrates arguments to options.inputFrom",
    input: {
      argument: "inputFrom.bladiebla",
      options: {},
    },
    expected: {
      options: {
        inputFrom: "inputFrom.bladiebla",
        inputType: "mscgen",
        outputTo: "inputFrom.svg",
        outputType: "svg",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
  {
    title: "arguments win from options.inputFrom",
    input: {
      argument: "argument.won",
      options: {
        inputFrom: "inputFrom.xxx",
      },
    },
    expected: {
      options: {
        inputFrom: "argument.won",
        inputType: "mscgen",
        outputTo: "argument.svg",
        outputType: "svg",
        regularArcTextVerticalAlignment: "middle",
      },
    },
  },
];

describe("cli/normalize", () => {
  describe("#normalize() - ", () => {
    TESTPAIRS.forEach((pPair) => {
      it(pPair.title, () => {
        const lNormalizedOptions = normalize(
          pPair.input.argument as string,
          pPair.input.options as CommanderStatic
        );

        expect(lNormalizedOptions).to.deep.equal(pPair.expected.options);
      });
    });
  });
});

/* eslint no-undefined: 0 */

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
