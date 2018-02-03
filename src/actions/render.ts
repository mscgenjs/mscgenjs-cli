import * as fs from "fs";
import * as puppeteer from "puppeteer";
import { INormalizedOptions, NamedStyleType, OutputType } from "../types";

function cookEvalFunction(pAST: string, pOptions: INormalizedOptions): string {
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

export async function renderTheShizzle(pAST: string, pOptions: INormalizedOptions) {

    let browser: puppeteer.Browser = {} as puppeteer.Browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
            // devtools: true,
        });

        const page = await browser.newPage();

        await page.goto(
            `file:///${__dirname}/template.html`,
            {
                waitUntil: "networkidle2",
            },
        );

        await page.evaluate(cookEvalFunction(pAST, pOptions));

        await page.addScriptTag({
            path: "./node_modules/mscgenjs-inpage/dist/mscgen-inpage.js",
        });

        // TODO if rendering failed there's a pre instead of an
        // svg. Maybe listen to to the appearance of the
        // 'data-rendered-by' attribute on the mscgen#replaceme tag?
        await page.waitFor("svg#mscgenjsreplaceme", {timeout: 10000});

        if (pOptions.outputType === "svg") {
            return await page.evaluate(() => {
                return Promise.resolve(document.getElementsByTagName("svg")[0].outerHTML);
            });
        } else {
            await page.setViewport({
                deviceScaleFactor: 2,
                height: 1,
                isMobile: false,
                width: 1,
            });
            return await page.screenshot({
                fullPage: true,
                omitBackground: false,
                type: pOptions.outputType as any,
            });
        }
    } catch (e) {
        return e;
    } finally {
        if (Boolean(browser) && typeof browser.close === "function") {
            browser.close();
        }
    }

}
