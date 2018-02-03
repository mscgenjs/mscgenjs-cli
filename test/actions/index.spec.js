"use strict";
const index = require("../../dist/actions/index");
const chai  = require("chai");
const fs    = require("fs");

chai.use(require("chai-as-promised"));
const expect  = chai.expect;

describe('index()', () => {
    it("transpiles the rainbow", () => {
        expect(
            index.transform({
                inputFrom: `${__dirname}/fixtures/rainbow.mscin`,
                inputType: "mscgen",
                outputTo: `${__dirname}/output/rainbow.json`,
                outputType: "json"
            })
        ).to.eventually.equal(
            true
        )
    });
    it("when transpiling something non-existing - promise rejects", () => {
        expect(
            index.transform({
                inputFrom: `${__dirname}/fixtures/doesnotexist`,
                inputType: "json",
                outputTo: `${__dirname}/output/notanast.json`,
                outputType: "json"
            })
        ).to.eventually.be.rejected;
    });
    it("when transpiling something non-existing - promise rejects", () => {
        expect(
            index.transform({
                inputFrom: `${__dirname}/fixtures/invalid-mscgen.mscin`,
                inputType: "mscgen",
                outputTo: `${__dirname}/output/notanast.json`,
                outputType: "json"
            })
        ).to.eventually.be.rejected;
    });
});