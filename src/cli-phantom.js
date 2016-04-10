/* jshint phantom:true, strict: false */
/* globals renderInThePage */
var system = require('system');

var gPage           = system.args[1];
var gASTString      = system.args[2];
var gOutputType     = system.args[3];
var gModuleBase     = system.args[4];
var gRequirePath    = system.args[5];
var gStyleAdditions = system.args[6];

var page = require('webpage').create();

page.onCallback = function(pBBox){
    page.viewportSize = { width: pBBox.width, height: pBBox.height };
    console.log(page.renderBase64(gOutputType));
    phantom.exit();
};

page.onError = function(pMessage /*, pTrace*/) {
    console.error(pMessage);
    phantom.exit(1);
};

page.open(gPage, function(/*pStatus*/) {
    page.injectJs(gRequirePath);
    page.evaluate(
        function(pASTString, pModuleBase, pStyleAdditions){
            renderInThePage(pASTString, pModuleBase, pStyleAdditions);
        },
        gASTString,
        gModuleBase,
        gStyleAdditions
    );
});
