import { expect, should, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as render from "../../src/actions/render";
import { INormalizedOptions } from "../../src/types";

use(chaiAsPromised);

// tslint:disable-next-line: no-var-requires
const lAST = require("./fixtures/simplest.json");

should();

describe("render()", () => {
  it("should fail when passed a non-executable executablePath", (pDone) => {
    render
      .renderWithChromeHeadless(lAST, {
        outputType: "png",
        puppeteerOptions: {
          executablePath: "non/existing/path/to/chromium",
        },
      } as INormalizedOptions)
      .should.be.rejected.and.notify(pDone);
  });

  it("coughs up something when passed an ast asked to output svg", (pDone) => {
    render
      .renderWithChromeHeadless(lAST, {
        outputType: "svg",
        puppeteerOptions: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"], // ci server's docker/ linux does not support sandboxing yet
        },
      } as INormalizedOptions)
      .should.eventually.contain('<!DOCTYPE svg [<!ENTITY nbsp "&#160;">]>')
      .and.notify(pDone);
  });

  it("coughs something when passed an ast asked to output png", (pDone) => {
    render
      .renderWithChromeHeadless(lAST, {
        outputType: "png",
        puppeteerOptions: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"], // ci server's docker/ linux does not support sandboxing yet
        },
      } as INormalizedOptions)
      .should.be.fulfilled.and.notify(pDone);
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
