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

    function renderGraphics(pAST, pOutStream, pOutputType, pCallback){
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

        childProcess.execFile(binPath, args, (pErr, pStdout, pStderr) => {
            /* istanbul ignore else */
            if (pStdout) {
                if ('svg' === pOutputType) {
                    pOutStream.write(pStdout, pCallback);
                } else {
                    pOutStream.write(new Buffer(pStdout, 'base64'), pCallback);
                }
            }
            /* istanbul ignore if */
            if (pStderr) {
                process.stderr.write(pStderr);
            }
        });
    }

    function renderText(pAST, pOutStream, pOutputType, pCallback){
        if ("json" === pOutputType){
            pOutStream.write(JSON.stringify(pAST, null, "  "), pCallback);
        } else {
            pOutStream.write(
                mscgenjs.getTextRenderer(pOutputType).render(pAST),
                pCallback
            );
        }
    }

    function transform(pInStream, pOutStream, pOptions, pCallback){
        let lInput = "";

        pInStream.resume();
        pInStream.setEncoding("utf8");

        pInStream.on("data", pChunk => lInput += pChunk);

        pInStream.on("end", () => {
            pInStream.pause();
            let lAST = "json" === pOptions.inputType ?
                JSON.parse(lInput) :
                mscgenjs.getParser(pOptions.inputType).parse(lInput);
            render(lAST, pOutStream, pOptions, pCallback);
        });
    }

    function render(pAST, pOutStream, pOptions, pCallback) {
        if (GRAPHICSFORMATS.indexOf(pOptions.outputType) > -1) {
            renderGraphics (pAST, pOutStream, pOptions.outputType, pCallback);
        } else {
            renderText (pAST, pOutStream, pOptions.outputType, pCallback);
        }
    }

    return {
        transform(pOptions, pCallback) {
            transform(
                getInStream(pOptions.inputFrom),
                getOutStream(pOptions.outputTo),
                pOptions,
                pCallback
            );
        },

        printLicense() {
            /* istanbul ignore next */
            process.stdout.write(LICENSE);
            /* istanbul ignore next */
            process.exit(0);
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
