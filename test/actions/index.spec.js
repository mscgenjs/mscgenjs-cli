"use strict";
const index = require("../../dist/actions/index");
const chai  = require("chai");

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
        );
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

describe("removeAutoWidth", () => {
    const AST_WITH_WIDTH_EQUALS_AUTO = {
        "meta": {
            "extendedOptions": true,
            "extendedArcTypes": false,
            "extendedFeatures": true
        },
        "options": {
            "width": "auto"
        },
        "entities": [
            {
                "name": "a"
            }
        ]
    };
    const AST_WITH_WIDTH_NUMBER = {
        "meta": {
            "extendedOptions": true,
            "extendedArcTypes": false,
            "extendedFeatures": true
        },
        "options": {
            "width": "481"
        },
        "entities": [
            {
                "name": "a"
            }
        ]
    };
    const AST_WITHOUT_WIDTH_EQUALS_AUTO = {
        "meta": {
            "extendedOptions": true,
            "extendedArcTypes": false,
            "extendedFeatures": true
        },
        "options": {
        },
        "entities": [
            {
                "name": "a"
            }
        ]
    };

    it("removes the auto-width element if outputType === png", () => {
        expect(
            index.removeAutoWidth(AST_WITH_WIDTH_EQUALS_AUTO, "png")
        ).to.deep.equal(
            AST_WITHOUT_WIDTH_EQUALS_AUTO
        );
    });
    it("removes the auto-width element if outputType === jpeg", () => {
        expect(
            index.removeAutoWidth(AST_WITH_WIDTH_EQUALS_AUTO, "jpeg")
        ).to.deep.equal(
            AST_WITHOUT_WIDTH_EQUALS_AUTO
        );
    });
    it("leaves the auto-width element alone outputType === svg", () => {
        expect(
            index.removeAutoWidth(AST_WITH_WIDTH_EQUALS_AUTO, "svg")
        ).to.deep.equal(
            AST_WITH_WIDTH_EQUALS_AUTO
        );
    });
    it("leaves the width element if outputType === png and width is a number", () => {
        expect(
            index.removeAutoWidth(AST_WITH_WIDTH_NUMBER, "png")
        ).to.deep.equal(
            AST_WITH_WIDTH_NUMBER
        );
    });
    it("leaves the width element if outputType === jpeg and width is a number", () => {
        expect(
            index.removeAutoWidth(AST_WITH_WIDTH_NUMBER, "jpeg")
        ).to.deep.equal(
            AST_WITH_WIDTH_NUMBER
        );
    });
    it("leaves the width element if outputType === svg and width is a number", () => {
        expect(
            index.removeAutoWidth(AST_WITH_WIDTH_NUMBER, "svg")
        ).to.deep.equal(
            AST_WITH_WIDTH_NUMBER
        );
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

