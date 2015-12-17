/* jshint phantom:true, strict: false */
/* globals renderInThePage */
var system = require('system');

var gPage       = system.args[1];
var gASTString  = system.args[2];
var gOutputType = system.args[3];

var page = require('webpage').create();

page.onCallback = function(pBBox){
    page.viewportSize = { width: pBBox.width, height: pBBox.height };
    console.log(page.renderBase64(gOutputType));
    phantom.exit();
};

page.open(gPage, function(/*pStatus*/) {
    page.evaluate(
        function(pASTString){
            renderInThePage(pASTString);
        },
        gASTString
    );
});
