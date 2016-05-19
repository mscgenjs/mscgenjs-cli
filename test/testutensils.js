"use strict";

const fs     = require('fs');
const chai   = require("chai");
const expect = chai.expect;

chai.use(require("chai-xml"));

module.exports = (
    () => ({
        assertequalFileJSON (pFoundFileName, pExpectedFileName){
            expect(
                JSON.parse(
                    fs.readFileSync(pFoundFileName, {"encoding":"utf8"})
                )
            ).to.deep.equal(
                JSON.parse(
                    fs.readFileSync(pExpectedFileName, {"encoding": "utf8"})
                )
            );
        },

        assertequalToFile (pExpectedFileName, pFoundFileName){
            expect(
                fs.readFileSync(pFoundFileName, {"encoding":"utf8"})
            ).to.equal(
                fs.readFileSync(pExpectedFileName, {"encoding":"utf8"})
            );
        }
    })
)();
