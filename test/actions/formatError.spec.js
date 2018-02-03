"use strict";
const formatError = require("../../dist/actions/formatError");
const chai    = require("chai");
const expect  = chai.expect;

describe('formatError()', () => {
    it("returns the message of non-syntax errors", () => {
        expect(formatError(new Error('hatsikidee!'))).to.equal('hatsikidee!');
    });

    it("returns man and horse of syntax errors", () => {
        let lErr = new Error('Make my day!');

        lErr.location = {
            start : {
                line : 481,
                column : 69
            }
        };

        expect(
            formatError(lErr)
        ).to.equal(`\n  syntax error on line 481, column 69:\n  Make my day!\n\n`);
    });
});
