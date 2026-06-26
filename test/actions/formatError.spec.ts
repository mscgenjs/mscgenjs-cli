import { equal } from "node:assert/strict";
import { describe, it } from "node:test";
import formatError from "../../src/actions/formatError.js";

describe("formatError()", () => {
  it("returns the message of non-syntax errors", () => {
    equal(formatError(new Error("hatsikidee!")), "hatsikidee!");
  });

  it("returns man and horse of syntax errors", () => {
    const lErr: any = new Error("Make my day!");

    lErr.location = {
      start: {
        column: 69,
        line: 481,
      },
    };

    equal(
      formatError(lErr),
      `\n  syntax error on line 481, column 69:\n  Make my day!\n\n`,
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
