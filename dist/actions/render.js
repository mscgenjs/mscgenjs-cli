"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWithChromeHeadless = void 0;
const puppeteer = require("puppeteer");
function cookEvalFunction(pAST, pOptions) {
    return `const lReplaceMe = document.getElementById('replaceme');
        lReplaceMe.setAttribute("data-language", "json");
        lReplaceMe.setAttribute("data-named-style", "${pOptions.namedStyle}");
        lReplaceMe.setAttribute("data-mirror-entities", ${pOptions.mirrorEntities});
        lReplaceMe.setAttribute(
            "data-regular-arc-text-vertical-alignment",
            "${pOptions.regularArcTextVerticalAlignment}"
        );
        lReplaceMe.innerHTML = \`${pAST.replace(/\\/g, "\\\\")}\``;
}
function getPuppeteerLaunchOptions(pPuppeteerLaunchOptions) {
    return Object.assign({
        headless: true,
    }, pPuppeteerLaunchOptions || {});
}
function renderSVG(page) {
    return __awaiter(this, void 0, void 0, function* () {
        /* the istanbul ignore thing is so istanbul won't instrument code
          that is meant to be run in browser context. If it does,
          you'll get errors like 'Error: Evaluation failed: ReferenceError: cov_'
          - which is chrome (not node) telling us something is foobar
        */
        /* istanbul ignore next */
        return yield page.evaluate(() => {
            const lSVGElement = document.getElementById("mscgenjsreplaceme");
            const SVG_DOCTYPE = '<!DOCTYPE svg [<!ENTITY nbsp "&#160;">]>';
            if (lSVGElement) {
                return Promise.resolve(SVG_DOCTYPE + lSVGElement.outerHTML);
            }
            return Promise.reject("Couldn't render the SVG.");
        });
    });
}
function renderBitmap(page, pOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.setViewport({
            deviceScaleFactor: 2,
            height: 1,
            isMobile: false,
            width: 1,
        });
        return yield page.screenshot({
            fullPage: true,
            omitBackground: false,
            type: pOptions.outputType,
        });
    });
}
function renderWithChromeHeadless(pAST, pOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        let browser = {};
        try {
            browser = yield puppeteer.launch(getPuppeteerLaunchOptions(pOptions.puppeteerOptions));
            const page = yield browser.newPage();
            yield page.goto(`file:///${__dirname}/template.html`, {
                waitUntil: "networkidle2",
            });
            yield page.evaluate(cookEvalFunction(JSON.stringify(pAST), pOptions));
            yield page.addScriptTag({
                path: require.resolve("mscgenjs-inpage"),
            });
            yield page.waitForSelector("mscgen#replaceme[data-renderedby='mscgen_js']");
            if (pOptions.outputType === "svg") {
                return yield renderSVG(page);
            }
            else {
                return yield renderBitmap(page, pOptions);
            }
        }
        finally {
            if (Boolean(browser) && typeof browser.close === "function") {
                browser.close();
            }
        }
    });
}
exports.renderWithChromeHeadless = renderWithChromeHeadless;
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
