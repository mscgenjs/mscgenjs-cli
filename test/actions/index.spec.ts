import {deepEqual, equal, rejects } from "node:assert/strict";
import * as index from "../../src/actions/index";
import type { INormalizedOptions } from "../../src/types";
import { resetOutputDir } from "./utl";

describe("index()", () => {
  before("set up", resetOutputDir("integration-output"));

  after("tear down", resetOutputDir("integration-output"));

  it("transpiles the rainbow", async () => {
    const lResult = await index.transform({
      inputFrom: `${__dirname}/fixtures/rainbow.mscin`,
      inputType: "mscgen",
      outputTo: `${__dirname}/integration-output/rainbow.json`,
      outputType: "json",
    } as INormalizedOptions);
    equal(lResult, true);
  });
  it("when transpiling something non-existing - promise rejects", async () => {
    await rejects(
      index.transform({
        inputFrom: `${__dirname}/fixtures/doesnotexist`,
        inputType: "json",
        outputTo: `${__dirname}/integration-output/notanast.json`,
        outputType: "json",
      } as INormalizedOptions),
    );
  });
  it("when transpiling something non-existing - promise rejects", async () => {
    await rejects(
      index.transform({
        inputFrom: `${__dirname}/fixtures/invalid-mscgen.mscin`,
        inputType: "mscgen",
        outputTo: `${__dirname}/integration-output/notanast.json`,
        outputType: "json",
      } as INormalizedOptions),
    );
  });
});

describe("removeAutoWidth", () => {
  const AST_WITH_WIDTH_EQUALS_AUTO = {
    meta: {
      extendedArcTypes: false,
      extendedFeatures: true,
      extendedOptions: true,
    },
    options: {
      width: "auto",
    },
    entities: [
      {
        name: "a",
      },
    ],
  };
  const AST_WITH_WIDTH_NUMBER = {
    meta: {
      extendedOptions: true,
      extendedArcTypes: false,
      extendedFeatures: true,
    },
    options: {
      width: "481",
    },
    entities: [
      {
        name: "a",
      },
    ],
  };
  const AST_WITHOUT_WIDTH_EQUALS_AUTO = {
    meta: {
      extendedOptions: true,
      extendedArcTypes: false,
      extendedFeatures: true,
    },
    options: {},
    entities: [
      {
        name: "a",
      },
    ],
  };

  it("removes the auto-width element if outputType === png", () => {
    deepEqual(
      index.removeAutoWidth(AST_WITH_WIDTH_EQUALS_AUTO, "png"),
      AST_WITHOUT_WIDTH_EQUALS_AUTO,
    );
  });
  it("removes the auto-width element if outputType === jpeg", () => {
    deepEqual(
      index.removeAutoWidth(AST_WITH_WIDTH_EQUALS_AUTO, "jpeg"),
      AST_WITHOUT_WIDTH_EQUALS_AUTO,
    );
  });
  it("leaves the auto-width element alone outputType === svg", () => {
    deepEqual(
      index.removeAutoWidth(AST_WITH_WIDTH_EQUALS_AUTO, "svg"),
      AST_WITH_WIDTH_EQUALS_AUTO,
    );
  });
  it("leaves the width element if outputType === png and width is a number", () => {
    deepEqual(
      index.removeAutoWidth(AST_WITH_WIDTH_NUMBER, "png"),
      AST_WITH_WIDTH_NUMBER,
    );
  });
  it("leaves the width element if outputType === jpeg and width is a number", () => {
    deepEqual(
      index.removeAutoWidth(AST_WITH_WIDTH_NUMBER, "jpeg"),
      AST_WITH_WIDTH_NUMBER,
    );
  });
  it("leaves the width element if outputType === svg and width is a number", () => {
    deepEqual(
      index.removeAutoWidth(AST_WITH_WIDTH_NUMBER, "svg"),
      AST_WITH_WIDTH_NUMBER,
    );
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
