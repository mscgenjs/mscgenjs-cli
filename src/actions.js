/* jshint node:true, unused:true */
"use strict";

module.exports = (() => {
    const fs        = require("fs");
    const mscgenjs  = require("mscgenjs");

    const GRAPHICSFORMATS = ['svg', 'png', 'jpeg'];
    const LICENSE = `
    mscgen_js - turns text into sequence charts
    Copyright (C) 2015  Sander Verweij

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

 `;
    function callback2Promise(pError, pSuccess, pResolve, pReject) {
        if(!!pError){
            pReject(pError);
        } else {
            pResolve(pSuccess);
        }
    }

    function getOutStream(pOutputTo) {
        /* istanbul ignore if */
        if ("-" === pOutputTo) {
            return process.stdout;
        } else {
            return fs.createWriteStream(pOutputTo);
        }
    }

    function getInStream(pInputFrom) {
        /* istanbul ignore if */
        if ("-" === pInputFrom) {
            return process.stdin;
        } else {
            return fs.createReadStream(pInputFrom);
        }
    }

    function renderGraphics(pAST, pOutStream, pOutputType){
        return new Promise((pResolve, pReject) => {
            const childProcess = require('child_process');
            const path         = require('path');
            const phantomjs    = require('phantomjs-prebuilt');
            const binPath      = phantomjs.path;

            let args           = [];

            if ('svg' === pOutputType){
                args.push(path.join(__dirname, '.', 'cli-phantom-vector.js'));
            } else {
                args.push(path.join(__dirname, '.', 'cli-phantom.js'));
            }
            args.push(path.join(__dirname, '.', 'cli-phantom.html'));
            args.push(JSON.stringify(pAST, null, ''));
            args.push(pOutputType);
            args.push(path.relative(__dirname, path.dirname(require.resolve('mscgenjs'))));
            args.push(path.relative(__dirname, require.resolve('requirejs/require.js')));

            childProcess.execFile(binPath, args, (pErr, pStdout/*, pStderr*/) => {
                if (!pErr) {
                    /* istanbul ignore else */
                    if (pStdout) {
                        if ('svg' === pOutputType) {
                            pOutStream.write(
                                pStdout,
                                (pError, pSuccess) =>
                                    callback2Promise(pError, pSuccess, pResolve, pReject)
                            );
                        } else {
                            pOutStream.write(
                                new Buffer(pStdout, 'base64'),
                                (pError, pSuccess) =>
                                    callback2Promise(pError, pSuccess, pResolve, pReject)
                            );
                        }
                    } else {
                        pReject(new Error(
                            `Mysteriously, rendering didn't work, but it didn't raise an error either.\n` +
                            `It would help tremendously if you raised an issue on github with this link:\n` +
                            `https://github.com/sverweij/mscgenjs-cli/issues/new?title=Unexpected%20error:%20"Mysteriously,%20rendering%20didn't%20work,%20but%20it%20didn't%20raise%20an%20error%20either."&body=What%20did%20I%20do%20to%20get%20this?`
                        ));
                    }
                } else {
                    pReject(pErr);
                }
            });
        });
    }

    function renderText(pAST, pOutStream, pOutputType){
        return new Promise ((pResolve, pReject) => {
            if ("json" === pOutputType){
                pOutStream.write(
                    JSON.stringify(pAST, null, "  "),
                    (pError, pSuccess) =>
                        callback2Promise (pError, pSuccess, pResolve, pReject)
                );
            } else {
                pOutStream.write(
                    mscgenjs.getTextRenderer(pOutputType).render(pAST),
                    (pError, pSuccess) =>
                        callback2Promise (pError, pSuccess, pResolve, pReject)
                );
            }
        });
    }

    function getAST(pInput, pInputType) {
        if ("json" === pInputType){
            return JSON.parse(pInput);
        } else {
            return mscgenjs.getParser(pInputType).parse(pInput);
        }
    }

    function parse(pInStream, pOptions) {
        return new Promise ((pResolve, pReject) => {
            let lInput = "";

            pInStream.resume();
            pInStream.setEncoding("utf8");

            pInStream.on("data", pChunk => lInput += pChunk);

            pInStream.on("end", () => {
                try {
                    pInStream.pause();
                    let lAST = getAST(lInput, pOptions.inputType);
                    pResolve(lAST);
                } catch (e) {
                    pReject(e);
                }
            });

            pInStream.on("error", (e) => {
                pReject(e);
            });
        });
    }

    function render(pAST, pOutStream, pOptions) {
        if (GRAPHICSFORMATS.indexOf(pOptions.outputType) > -1) {
            return renderGraphics (pAST, pOutStream, pOptions.outputType);
        } else {
            return renderText (pAST, pOutStream, pOptions.outputType);
        }
    }

    return {
        transform(pOptions) {
            return parse(
                getInStream(pOptions.inputFrom),
                pOptions
            ).then (pAST => {
                return render(
                    pAST,
                    getOutStream(pOptions.outputTo),
                    pOptions
                );
            });
        },

        LICENSE: LICENSE,

        formatError (e) {
            if (!!e.location){
                return `\n  syntax error on line ${e.location.start.line}, column ${e.location.start.column}:\n  ${e.message}\n\n`;
            } else {
                return e.message;
            }
        }
    };
})();
/*
    This file is part of mscgen_js.

    mscgen_js is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    mscgen_js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
*/
