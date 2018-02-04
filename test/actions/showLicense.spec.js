"use strict";

const chai   = require("chai");
const expect = chai.expect;
const showLicense = require("../../dist/actions/showLicense");

describe('showLicense()', () => {
    it("returns the license", () => {
        expect(
            showLicense()
        ).to.contain(
            "GNU General Public License"
        );
    });

    it("has the current year in it", () => {
        expect(
            showLicense()
        ).to.contain(
            `-${new Date().getUTCFullYear()}`
        );
    });
});
