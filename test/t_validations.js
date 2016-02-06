"use strict";

const path   = require("path");
const chai   = require("chai");
const assert = chai.assert;
const expect = chai.expect;
const val    = require("../src/validations");

describe('cli/validations', () => {

    describe('#validOutputType() - ', () => {
        it("'notavalidOutputType' is not a valid output type", () => {
            let lFoundError = "";
            try {
                val.validOutputType("notavalidOutputType");
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'notavalidOutputType' is not a valid output type.");
        });

        it("'svg' is a valid type", () => {
            assert.equal(val.validOutputType("svg"), "svg");
        });
    });

    describe('#validInputType() - ', () => {
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

    describe('#validateArguments() - ', () => {
        it("'-T svg -o kaboeki.svg fixtures/rainbow.mscin is oki", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: path.join(__dirname, "fixtures/rainbow.mscin"),
                        outputTo: "kaboeki.svg",
                        outputType: "svg"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T mscgen -o - -' is oki", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "mscgen"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T dot -i - -o -' is oki", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "dot"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T xu -o - input-doesnot-exists' complains about non existing file", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom  : "input-doesnot-exist",
                        outputTo   : "-",
                        outputType : "xu"
                    }
                );
                assert.equal("still here", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Failed to open input file 'input-doesnot-exist'\n\n");
            }
        });

        it("'-T svg -o - ' complains about non existing file", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom  : "input-doesnot-exist",
                        outputTo   : "-",
                        outputType : "xu"
                    }
                );
                assert.equal("still here", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Failed to open input file 'input-doesnot-exist'\n\n");
            }
        });

        it("'-T svg -' complains about non specified input file", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputType: "svg"
                    }
                );
                assert.equal("still here?", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Please specify an output file.\n\n");
            }
        });

        it("'-i -' complains about non specified output file", () => {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-"
                    }
                );
                assert.equal("still here?", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Please specify an output file.\n\n");
            }
        });

        it("complains about non specified input file", () => {
            try {
                val.validateArguments({});
                assert.equal("still here?", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Please specify an input file.\n\n");
            }
        });
    });
});
