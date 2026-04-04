import { equal } from "node:assert/strict";
import * as fs from "fs";
import * as path from "path";
import * as stream from "stream";
import { getInStream, getOutStream } from "../../src/actions/fileNameToStream";
import { resetOutputDir } from "./utl";
import { notEqual } from "node:assert";

const OUTDIR = "output";
const OUTFILE = path.join(__dirname, OUTDIR, "tmp_hello.json");

describe("fileNameToStream", () => {
  before("set up", resetOutputDir(OUTDIR));

  after("tear down", resetOutputDir(OUTDIR));

  it("getOutStream('-') is a writable stream", () => {
    equal(getOutStream("-") instanceof stream.Writable, true);
  });
  it("getOutStream('-') yields stdout", () => {
    equal(getOutStream("-"), process.stdout);
  });
  it("getOutStream('-') yields does not yield a file stream", () => {
    equal(getOutStream("-") instanceof fs.WriteStream, false);
  });
  it("getOutStream(OUTFILE) yields a writable stream", () => {
    equal(getOutStream(OUTFILE) instanceof stream.Writable, true);
  });
  it("getOutStream(OUTFILE) yields a writable file stream", () => {
    equal(getOutStream(OUTFILE) instanceof fs.WriteStream, true);
  });
  it("getOutStream(OUTFILE) does not yields stdout", () => {
    notEqual(getOutStream(OUTFILE), process.stdout);
  });

  it("getInStream('-') is a readable stream", () => {
    equal(getInStream("-") instanceof stream.Readable, true);
  });
  it("getInStream('-') yields stdin", () => {
    equal(getInStream("-"), process.stdin);
  });
  it("getInStream('-') does not yield a file stream", () => {
    equal(getInStream("-") instanceof fs.ReadStream, false);
  });
  it("getInStream(OUTFILE) yields a writable stream", () => {
    equal(getInStream(OUTFILE) instanceof stream.Readable, true);
  });
  it("getInStream(OUTFILE) yields a readable file stream", () => {
    equal(getInStream(OUTFILE) instanceof fs.ReadStream, true);
  });
  it("getInStream(OUTFILE) does not yields stdin", () => {
    notEqual(getInStream(OUTFILE), process.stdin);
  });
});
// tslint:enable no-unused-expression

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
