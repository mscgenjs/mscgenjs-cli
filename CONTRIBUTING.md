## Contributing

So you want to contribute to mscgen_js? We already love you!

To make this as easy as possible for you, here's some simple guidelines:

### Reporting issues
- All **issues** are **welcome**.    
  - These include bug reports, questions, feature requests and enhancement proposals
  - [GitHub's issue tracker](https://github.com/mscgenjs/mscgenjs-cli/issues) is the easiest way to submit them.
- We prefer bug reports in  **_steps taken_ - _expected_ - _found_** format.
  -  that makes it more easy to reproduce it, and concoct a solution that fits your expectation.
  - If applicable, it is also nice when you provide
    - the **input** you used and
    - the **environment** (browser version/ os, or node.js version + os).
  - [template](#issue-template) at the bottom
- In turn, we try to **respond within a week**.    
  This might or might not include an actual code fix.

### Contributing code
- We prefer well documented **[pull requests](https://help.github.com/articles/creating-a-pull-request/)**
  based on the most recent version of the **master** branch.
- Code quality: additions pass `npm run check:full` which a.o. means:
    - Mocha tests prove your code does what it intends.
    - Your code does not introduce regressions and doesn't decrease code coverage
    - The code you add follows the project's lint rules (mostly tslint:recommended) 
      hint: run `npm run lint:fix` to check and auto-fix
- Plan to do something drastic?     
  Contact @SanderSpeaks on Twitter, or leave an [issue](https://github.com/mscgenjs/mscgenjs-cli/issues/new) on GitHub

### Legal
- the code you add will be subject to [GPLv3](wikum/licenses/license.mscgen_js.md
), just like the rest of mscgen_js
- the code you add is your own original work


### Issue template
    ### steps taken

    ### expected

    ### found

    ### notes
