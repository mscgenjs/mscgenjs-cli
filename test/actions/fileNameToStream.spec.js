
const chai    = require("chai");
const stream  = require("stream");
const fs      = require("fs");
const expect  = chai.expect;
const getOutStream = require("../../dist/actions/fileNameToStream").getOutStream;
const getInStream = require("../../dist/actions/fileNameToStream").getInStream;

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
