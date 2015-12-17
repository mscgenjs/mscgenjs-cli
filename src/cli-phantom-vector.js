/* jshint phantom:true, strict: false */
/* globals renderVectorInThePage */
var system = require('system');

var gPage       = system.args[1];
var gASTString  = system.args[2];

var page = require('webpage').create();

page.onCallback = function(pSVG){
    console.log(pSVG);
    phantom.exit();
};

page.open(gPage, function(/*pStatus*/) {
    page.evaluate(
        function(pASTString){
            renderVectorInThePage(pASTString);
        },
        gASTString
    );
});
