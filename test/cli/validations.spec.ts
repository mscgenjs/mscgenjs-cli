"use strict";
import {assert, expect} from "chai";
import * as path from "path";
import * as val from "../../src/cli/validations";
import { INormalizedOptions, NamedStyleType, OutputType } from "../../src/types";

describe("cli/validations", () => {

    describe("#validOutputType() - ", () => {
        it("'notavalidOutputType' is not a valid output type", () => {
            let lFoundError = "";

            try {
                val.validOutputType("notavalidOutputType" as OutputType);
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'notavalidOutputType' is not a valid output type.");
        });

        it("'svg' is a valid type", () => {
            assert.equal(val.validOutputType("svg"), "svg");
        });
    });

    describe("#validInputType() - ", () => {
        it("'dot' is not a valid input type", () => {
            let lFoundError = "";

            try {
                val.validInputType("dot");
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'dot' is not a valid input type");
        });

        it("'ast' is a valid type", () => {
            assert.equal(val.validInputType("ast"), "ast");
        });
    });

    describe("#validNamedStyle() - ", () => {
        it("'unrecognized' is not a recognized style", () => {
            let lFoundError = "";

            try {
                val.validNamedStyle("unrecognized" as NamedStyleType);
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'unrecognized' is not a recognized named style");
        });

        it("'lazy' is a valid named style", () => {
            assert.equal(val.validNamedStyle("lazy"), "lazy");
        });
    });

    describe("#verticalAlignment() - ", () => {
        it("'untoward' is not a recognized alignment", () => {
            let lFoundError = "";

            try {
                val.validVerticalAlignment("untoward");
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'untoward' is not a recognized vertical alignment");
        });

        it("'above' is a valid vertical alignment", () => {
            assert.equal(val.validVerticalAlignment("above"), "above");
        });
    });

    describe("#validateArguments() - ", () => {
        it("'-T svg -o kaboeki.svg fixtures/rainbow.mscin is oki", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: path.join(__dirname, "../actions/fixtures/rainbow.mscin"),
                        outputTo: "kaboeki.svg",
                        outputType: "svg",
                    } as INormalizedOptions,
                );
                assert.equal("still here", "still here");
            } catch (e) {
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T mscgen -o - -' is oki", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "mscgen",
                    } as INormalizedOptions,
                );
                assert.equal("still here", "still here");
            } catch (e) {
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T dot -i - -o -' is oki", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "dot",
                    } as INormalizedOptions,
                );
                assert.equal("still here", "still here");
            } catch (e) {
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T xu -o - input-doesnot-exists' complains about non existing file", () => {
            val.validateArguments(
                {
                    inputFrom  : "input-doesnot-exist",
                    outputTo   : "-",
                    outputType : "xu",
                } as INormalizedOptions,
            ).then(() => {
                assert.equal("still here", "should not be here!");
            }).catch((e) => {
                assert.equal(e.message, "\n  error: Failed to open input file 'input-doesnot-exist'\n\n");
            });
        });

        it("'-T svg -o - ' complains about non existing file", () => {
            val.validateArguments(
                {
                    inputFrom  : "input-doesnot-exist",
                    outputTo   : "-",
                    outputType : "xu",
                } as INormalizedOptions,
            ).then(() => {
                assert.equal("still here", "should not be here!");
            }).catch((e) => {
                assert.equal(e.message, "\n  error: Failed to open input file 'input-doesnot-exist'\n\n");
            });
        });

        it("'-T svg -' complains about non specified input file", () => {
            val.validateArguments(
                {
                    inputFrom: "-",
                    outputType: "svg",
                } as INormalizedOptions,
            ).then(() => {
                assert.equal("still here?", "should not be here!");
            }).catch((e) => {
                assert.equal(e.message, "\n  error: Please specify an output file.\n\n");
            });
        });

        it("'-i -' complains about non specified output file", () => {
            val.validateArguments(
                {
                    inputFrom: "-",
                } as INormalizedOptions,
            ).then(() => {
                assert.equal("still here?", "should not be here!");
            }).catch((e) => {
                assert.equal(e.message, "\n  error: Please specify an output file.\n\n");
            });
        });

        it("complains about non specified input file", () => {
            val.validateArguments({} as INormalizedOptions).then(() => {
                assert.equal("still here?", "should not be here!");
            }).catch((e) => {
                assert.equal(e.message, "\n  error: Please specify an input file.\n\n");
            });
        });
    });

    describe("#validPuppeteerOptions() - ", () => {
        it("barfs if passed file does not exist", () => {
            let lFoundError = "";
            const lFixture = "this-file-does-not-exist";

            try {
                val.validPuppeteerOptions(lFixture);
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain(`error: Failed to open puppeteer options configuration file '${lFixture}'`);
        });

        it("barfs if passed file is no valid json", () => {
            let lFoundError = "";
            const lFixture = path.join(__dirname, "fixtures", "invalid-json.json");

            try {
                val.validPuppeteerOptions(lFixture);
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain(`error: '${lFixture}' does not contain valid JSON`);
        });

        it("barfs if passed file is no valid json", () => {
            let lFoundError = "";
            const lFixture = path.join(__dirname, "fixtures", "invalid-puppeteer-config.json");

            try {
                val.validPuppeteerOptions(lFixture);
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain(`error: '${lFixture}' does not contain`);
        });

        it("returns the parsed json if passed file is valid json", () => {
            const lFoundError = "";
            const lFixture = path.join(__dirname, "fixtures", "valid-puppeteer-config.json");
            expect(
                val.validPuppeteerOptions(lFixture),
            ).to.deep.equal(
                {
                    args: [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                    ],
                    executablePath: "/usr/bin/google-chrome",
                },
            );

        });
    });
});

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
