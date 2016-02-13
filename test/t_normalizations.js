"use strict";

const expect    = require("chai").expect;
const norm      = require("../src/normalizations");

const TESTPAIRS = [
    {
        title: "leaves a fully specified program alone",
        input: {
            options: {
                inputFrom: "input.xu",
                inputType: "msgenny",
                outputTo: "output.svg",
                outputType: "mscgen"
            }
        },
        expected: {
            options: {
                inputFrom: "input.xu",
                inputType: "msgenny",
                outputTo: "output.svg",
                outputType: "mscgen"
            }
        }
    },
    {
        title: "guesses the input type, takes a default for the output type",
        input: {
            options: {
                inputFrom: "input.xu",
                outputTo: "output.svg"
            }
        },
        expected: {
            options: {
                inputFrom: "input.xu",
                inputType: "xu",
                outputTo: "output.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "if parser-output is specified take sets outputType to 'json'",
        input: {
            options: {
                inputFrom: "w00tchart.mscin",
                parserOutput: true
            }
        },
        expected: {
            options: {
                inputFrom: "w00tchart.mscin",
                inputType: "mscgen",
                outputType: "json",
                outputTo: "w00tchart.json",
                parserOutput: true
            }
        }
    },
    {
        title: "guesses the output type from a given filename",
        input: {
            options: {
                inputFrom: "w00tchart.seq",
                outputTo: "a nice file.notanextension.png"
            }
        },
        expected: {
            options: {
                inputFrom: "w00tchart.seq",
                inputType: "mscgen",
                outputType: "png",
                outputTo: "a nice file.notanextension.png"
            }
        }
    },
    {
        title: "cannot guess the input type when it is stdin, so takes a default",
        input: {
            options: {
                inputFrom: "-",
                outputTo: "output.svg"
            }
        },
        expected: {
            options: {
                inputFrom: "-",
                inputType: "mscgen",
                outputTo: "output.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "treats .ast as .json",
        input: {
            options: {
                inputFrom: "achoo.ast"
            }
        },
        expected: {
            options: {
                inputFrom: "achoo.ast",
                inputType: "json",
                outputTo: "achoo.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "treats .ast as .json - even wen explicitly stated in options.inputType",
        input: {
            options: {
                inputFrom: "achoo.interestingextension",
                inputType: "ast"
            }
        },
        expected: {
            options: {
                inputFrom: "achoo.interestingextension",
                inputType: "json",
                outputTo: "achoo.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "can't guess outputTo when inputFrom is stdin",
        input: {
            options: {
                inputFrom: "-"
            }
        },
        expected: {
            options: {
                inputFrom: "-",
                inputType: "mscgen",
                outputTo: undefined,
                outputType: "svg"
            }
        }
    },
    {
        title: "can't guess outputTo when inputFrom is not there",
        input: {
            options: {
            }
        },
        expected: {
            options: {
                inputFrom: undefined,
                inputType: "mscgen",
                outputTo: undefined,
                outputType: "svg"
            }
        }
    },
    {
        title: "migrates arguments to options.inputFrom",
        input: {
            argument: "inputFrom.bladiebla",
            options: {}
        },
        expected: {
            options: {
                inputFrom: "inputFrom.bladiebla",
                inputType: "mscgen",
                outputTo: "inputFrom.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "arguments win from options.inputFrom",
        input: {
            argument: "argument.won",
            options: {
                inputFrom: "inputFrom.xxx"
            }
        },
        expected: {
            options: {
                inputFrom: "argument.won",
                inputType: "mscgen",
                outputTo: "argument.svg",
                outputType: "svg"
            }
        }
    }
];

describe('cli/normalizations', () => {
    describe('#normalize() - ', () => {
        TESTPAIRS.forEach((pPair) => {
            it(pPair.title, () => {
                let lNormalizedOptions = norm.normalize(pPair.input.argument, pPair.input.options);
                expect(
                    lNormalizedOptions
                ).to.deep.equal(
                    pPair.expected.options
                );
            });
        });
    });
});
