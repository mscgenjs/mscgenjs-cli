"use strict";
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
async function renderSVG(page) {
    /* the istanbul ignore thing is so istanbul won't instrument code
      that is meant to be run in browser context. If it does,
      you'll get errors like 'Error: Evaluation failed: ReferenceError: cov_'
      - which is chrome (not node) telling us something is foobar
    */
    /* istanbul ignore next */
    return await page.evaluate(() => {
        const lSVGElement = document.getElementById("mscgenjsreplaceme");
        const SVG_DOCTYPE = '<!DOCTYPE svg [<!ENTITY nbsp "&#160;">]>';
        if (lSVGElement) {
            return Promise.resolve(SVG_DOCTYPE + lSVGElement.outerHTML);
        }
        return Promise.reject("Couldn't render the SVG.");
    });
}
async function renderBitmap(page, pOptions) {
    await page.setViewport({
        deviceScaleFactor: 2,
        height: 1,
        isMobile: false,
        width: 1,
    });
    return await page.screenshot({
        fullPage: true,
        omitBackground: false,
        type: pOptions.outputType,
    });
}
async function renderWithChromeHeadless(pAST, pOptions) {
    let browser = {};
    try {
        browser = await puppeteer.launch(getPuppeteerLaunchOptions(pOptions.puppeteerOptions));
        const page = await browser.newPage();
        await page.goto(`file:///${__dirname}/template.html`, {
            waitUntil: "networkidle2",
        });
        await page.evaluate(cookEvalFunction(JSON.stringify(pAST), pOptions));
        await page.addScriptTag({
            path: require.resolve("mscgenjs-inpage"),
        });
        await page.waitForSelector("mscgen#replaceme[data-renderedby='mscgen_js']");
        if (pOptions.outputType === "svg") {
            return await renderSVG(page);
        }
        else {
            return await renderBitmap(page, pOptions);
        }
    }
    finally {
        if (Boolean(browser) && typeof browser.close === "function") {
            browser.close();
        }
    }
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
