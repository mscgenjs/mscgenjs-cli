.SUFFIXES: .js .html .msc .mscin .msgenny .svg .png .jpg .xu
GIT=git
NPM=npm
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to jsdependencies.mk --exclude node_modules

.PHONY: help dev-build install deploy-gh-pages check stylecheck fullcheck mostlyclean clean lint cover prerequisites report test update-dependencies run-update-dependencies depend bower-package

help:
	@echo " --------------------------------------------------------"
	@echo "| Just downloaded mscgenjs-cli from a git repo?          |"
	@echo "|  First run 'make prerequisites' or 'npm install'       |"
	@echo "|                                                        |"
	@echo "| (not necessary when you installed it from npm)         |"
	@echo " --------------------------------------------------------"
	@echo
	@echo "Most important build targets:"
	@echo
	@echo "check"
	@echo " runs the linter, style checker and executes all unit tests"
	@echo
	@echo "clean"
	@echo " cleans up coverage results"
	@echo
	@echo "update-dependencies"
	@echo " updates all (node) module dependencies in package.json"
	@echo " installs them, rebuilds all generated sources and runs"
	@echo " all tests."
	@echo

# dependencies
include jsdependencies.mk
include dependencies.mk

.npmignore: .gitignore
	cp $< $@
	echo "samples/**" >> $@
	echo "test/**" >> $@
	echo "utl/**" >> $@
	echo ".bithoundrc" >> $@
	echo ".codeclimate.yml" >> $@
	echo ".eslintignore" >> $@
	echo ".eslintrc.json" >> $@
	echo ".gitlab-ci.yml" >> $@
	echo ".istanbul.yml" >> $@
	echo ".travis.yml" >> $@
	echo "Makefile" >> $@
	echo "dependencies.mk" >> $@
	echo "jsdependencies.mk" >> $@

# "phony" targets
prerequisites: .npmignore
	$(NPM) install

lint:
	$(NPM) run lint

cover: src/mscgen.js
	$(NPM) run cover

tag:
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

.git/refs/remotes/bitbkucket-mirror:
	$(GIT) remote add bitbucket-mirror git@bitbucket.org:sverweij/mscgenjs-cli.git

.git/refs/remotes/gitlab-mirror:
	$(GIT) remote add gitlab-mirror https://gitlab.com/sverweij/mscgenjs-cli.git

mirrors: .git/refs/remotes/bitbucket-mirror \
	.git/refs/remotes/gitlab-mirror

push-mirrors: mirrors
	$(GIT) push bitbucket-mirror
	$(GIT) push gitlab-mirror

test:
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated

check: lint stylecheck test
	@echo running some simple mscgen_js commands to make sure the binary is working..
	./bin/mscgen_js --version
	./bin/mscgen_js --license

fullcheck: check outdated nsp

update-dependencies: run-update-dependencies test nsp
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install

depend:
	$(MAKEDEPEND) --system cjs src/
	$(MAKEDEPEND) --append --system cjs --flat-define CLI_JS_SOURCES src/mscgen.js

clean-the-build:

clean:
	rm -rf coverage
