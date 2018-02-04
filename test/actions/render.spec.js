"use strict";
const render = require("../../dist/actions/render");
const chai   = require("chai");

chai.use(require("chai-as-promised"));
chai.use(require("chai-xml"));
const lAST    = JSON.stringify(require('./fixtures/simplest.json'));

chai.should();

describe('render()', () => {
    it("coughs up something when passed an ast asked to output svg", (pDone) => {
        render.renderTheShizzle(
            lAST,
            {
                outputType: "svg"
            }
        ).should.be.fulfilled.and.notify(pDone);
    });

    it("coughs something when passed an ast asked to output png", (pDone) => {
        render.renderTheShizzle(
            lAST,
            {
                outputType: "png"
            }
        ).should.be.fulfilled.and.notify(pDone);
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

