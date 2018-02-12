
import * as fs from "fs";
import * as stream from "stream";
import {getInStream, getOutStream} from "../../src/actions/fileNameToStream";
import {expect} from "chai";

describe("fileNameToStream", () => {
    it("getOutStream('-') is a writable stream", () => {
        expect(getOutStream("-") instanceof stream.Writable).to.be.true;
    });
    it("getOutStream('-') yields stdout", () => {
        expect(getOutStream("-")).to.equal(process.stdout);
    });
    it("getOutStream('-') yields does not yield a file stream", () => {
        expect(getOutStream("-") instanceof fs.WriteStream).to.be.false;
    });
    it("getOutStream('./tmp_hello') yields a writable stream", () => {
        expect(getOutStream("./tmp_hello") instanceof stream.Writable).to.be.true;
    });
    it("getOutStream('./tmp_hello') yields a writable file stream", () => {
        expect(getOutStream("./tmp_hello") instanceof fs.WriteStream).to.be.true;

    });
    it("getOutStream('./tmp_hello') does not yields stdout", () => {
        expect(getOutStream("./tmp_hello")).to.not.equal(process.stdout);
    });

    it("getInStream('-') is a readable stream", () => {
        expect(getInStream("-") instanceof stream.Readable).to.be.true;
    });
    it("getInStream('-') yields stdin", () => {
        expect(getInStream("-")).to.equal(process.stdin);
    });
    it("getInStream('-') does not yield a file stream", () => {
        expect(getInStream("-") instanceof fs.ReadStream).to.be.false;
    });
    it("getInStream('./tmp_hello') yields a writable stream", () => {
        expect(getInStream("./tmp_hello") instanceof stream.Readable).to.be.true;
    });
    it("getInStream('./tmp_hello') yields a readable file stream", () => {
        expect(getInStream("./tmp_hello") instanceof fs.ReadStream).to.be.true;
    });
    it("getInStream('./tmp_hello') does not yields stdin", () => {
        expect(getInStream("./tmp_hello")).to.not.equal(process.stdin);
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
