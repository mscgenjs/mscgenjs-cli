import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as fs from "fs";
import { readFromStream } from "../../src/actions/readFromStream";

use(chaiAsPromised);

describe("readFromStream()", () => {
  it("returns a promise that resolves to text from the stream", () => {
    expect(
      readFromStream(
        fs.createReadStream(`${__dirname}/fixtures/bigandhonking.xu`)
      )
    ).to.eventually.equal(
      fs.readFileSync(`${__dirname}/fixtures/bigandhonking.xu`, "utf8")
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
