# mscgenjs-cli Copilot Instructions

## Communication Style

Respond terse like smart caveman. All technical substance stay. Only fluff die.

Rules:
- Provide concise responses. no unnecessary elaboration
- Focus on code solutions. not lengthy explanations
- Use bullet points for multi-part information when appropriate
- Avoid repetition of information already visible in the code
- Drop: articles (a/an/the), filler (just/really/basically), pleasantries, hedging
- Fragments OK. Short synonyms. Technical terms exact. Code unchanged.
- Pattern: [thing] [action] [reason]. [next step].
- Not: "Sure! I'd be happy to help you with that."
- Yes: "Bug in auth middleware. Fix:"

Auto-Clarity: drop caveman for security warnings, irreversible actions, user confused. Resume after.

Boundaries: code/commits/PRs written normal.

## Build, Test, and Lint

```bash
# Build (compile TypeScript from src/ → dist/, copy static assets)
npm run build

# Run all tests (TypeScript via tsx, no pre-build needed)
npm test

# Run a single test file
npx tsx --test test/cli/normalize.spec.ts

# Run tests with coverage
npm run test:cover

# Format code (prettier over src/ and test/)
npm run lint:fix

# Validate dependency graph (must pass before releasing)
npm run depcruise

# Full check: build + depcruise + test:cover
npm run check
```

TypeScript source lives in `src/`, compiled output goes to `dist/`. Tests run directly from TypeScript using `tsx` — **do not edit files in `dist/`**.

## Architecture

The CLI is a thin Node.js wrapper around the `mscgenjs` library that renders sequence charts (mscgen, xu, msgenny formats) to SVG, PNG, JPEG, or text formats.

```
bin/mscgen_js          → entry point (requires dist/cli)
src/cli/index.ts       → arg parsing (node:util parseArgs), validation, orchestration
src/cli/normalize.ts   → maps raw CLI args → INormalizedOptions (guesses types from extensions)
src/cli/validations.ts → throws on invalid args; schema-validates puppeteer options via AJV
src/actions/index.ts   → routes: graphics output → render pipeline, text output → transpile
src/actions/render.ts  → launches headless Chromium via puppeteer to render SVG/PNG/JPEG
src/types.d.ts         → shared TypeScript interfaces (IOptions, INormalizedOptions, etc.)
```

**Graphics rendering pipeline** (`svg`, `png`, `jpeg`): reads input → parses to AST via `mscgenjs.translateMsc` → injects AST into `template.html` → puppeteer opens it → `mscgenjs-inpage` renders the SVG in browser context → page screenshot or SVG DOM extraction.

**Text transpile pipeline** (all other output types): reads input → `mscgenjs.translateMsc` with target format → writes string to output stream.

The `template.html` and `puppeteer-options.schema.json` are non-TypeScript assets that must be **copied** from `src/` to `dist/` as part of the build (`build:copy-*` scripts).

## Key Conventions

- **Variable prefix `l`**: local variables are prefixed with `l` (e.g., `lReturnValue`, `lOptions`). Parameter names are prefixed with `p` (e.g., `pOptions`, `pInput`).
- **`INormalizedOptions` vs `IOptions`**: raw CLI input uses `IOptions` (optionals); after `normalize()` everything is `INormalizedOptions` (all required). Only pass `INormalizedOptions` to `actions/`.
- **`-` means stdin/stdout**: the string `"-"` is the sentinel for standard streams throughout `fileNameToStream.ts` and `validations.ts`.
- **`ast` is an alias for `json`**: both input and output types normalize `"ast"` → `"json"` internally in `normalize.ts`.
- **No dev deps in `src/`**: `dependency-cruiser` enforces that `src/` cannot import devDependencies. Keep test utilities in `test/`.
- **Tests mirror source layout**: `test/cli/` tests `src/cli/`, `test/actions/` tests `src/actions/`. Spec files are named `*.spec.ts`.
- **GPL-3.0 license header**: every source file ends with the GPLv3 boilerplate comment block.
- **`node:util parseArgs`** replaced `commander` as the CLI arg parser — use it for any new options, not `commander`.
