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
        lReplaceMe.innerHTML = \`${pAST.replace(/\\/g, "\\\\")}\``;
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
            path: require.resolve("mscgenjs-inpage"),
        });

        await page.waitFor("mscgen#replaceme[data-renderedby='mscgen_js']", {timeout: 10000});

        if (pOptions.outputType === "svg") {
            return await page.evaluate(() => {
                const lSVGElement = document.getElementById("mscgenjsreplaceme");
                if (lSVGElement) {
                    return Promise.resolve(lSVGElement.outerHTML);
                }
                return Promise.reject("Couldn't render the SVG.");
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
    } catch (pError) {
        return pError;
    } finally {
        if (Boolean(browser) && typeof browser.close === "function") {
            browser.close();
        }
    }

}
