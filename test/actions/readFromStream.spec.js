"use strict";
const readFromStream = require("../../dist/actions/readFromStream").readFromStream;
const chai           = require("chai");
const fs             = require("fs");

chai.use(require("chai-as-promised"));
const expect  = chai.expect;

describe('readFromStream()', () => {
    it("returns a promise that resolves to text from the stream", () => {
        expect(
            readFromStream(
                fs.createReadStream(`${__dirname}/fixtures/bigandhonking.xu`)
            )
        ).to.eventually.equal(
            fs.readFileSync(`${__dirname}/fixtures/bigandhonking.xu`, 'utf8')
        );
    });
});
