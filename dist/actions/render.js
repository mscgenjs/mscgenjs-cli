"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        lReplaceMe.innerHTML = \`${pAST}\``;
}
function renderTheShizzle(pAST, pOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        let browser = {};
        try {
            browser = yield puppeteer.launch({
                headless: true,
            });
            const page = yield browser.newPage();
            yield page.goto(`file:///${__dirname}/template.html`, {
                waitUntil: "networkidle2",
            });
            yield page.evaluate(cookEvalFunction(pAST, pOptions));
            yield page.addScriptTag({
                path: "./node_modules/mscgenjs-inpage/dist/mscgen-inpage.js",
            });
            // TODO if rendering failed there's a pre instead of an
            // svg. Maybe listen to to the appearance of the
            // 'data-rendered-by' attribute on the mscgen#replaceme tag?
            yield page.waitFor("svg#mscgenjsreplaceme", { timeout: 10000 });
            if (pOptions.outputType === "svg") {
                return yield page.evaluate(() => {
                    return Promise.resolve(document.getElementsByTagName("svg")[0].outerHTML);
                });
            }
            else {
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
            }
        }
        catch (e) {
            return e;
        }
        finally {
            if (Boolean(browser) && typeof browser.close === "function") {
                browser.close();
            }
        }
    });
}
exports.renderTheShizzle = renderTheShizzle;
