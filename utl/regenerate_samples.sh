node bin/mscgen_js -T png -n lazy samples/autoscale.msgenny
node bin/mscgen_js -T png -n classic -o samples/style-variants/cheat-sheet-wide-classic.png samples/cheat-sheet-wide.msgenny
node bin/mscgen_js -T png -n cygne -o samples/style-variants/cheat-sheet-wide-cygne.png samples/cheat-sheet-wide.msgenny
node bin/mscgen_js -T png -n inverted -o samples/style-variants/cheat-sheet-wide-inverted.png samples/cheat-sheet-wide.msgenny
node bin/mscgen_js -T png -n lazy -o samples/style-variants/cheat-sheet-wide-lazy.png samples/cheat-sheet-wide.msgenny
node bin/mscgen_js -T png -n pegasse -o samples/style-variants/cheat-sheet-wide-pegasse.png samples/cheat-sheet-wide.msgenny
node bin/mscgen_js -T png -n fountainpen -o samples/style-variants/cheat-sheet-wide-fountainpen.png samples/cheat-sheet-wide.msgenny
node bin/mscgen_js -T png -o samples/style-variants/cheat-sheet-wide.png samples/cheat-sheet-wide.msgenny
node bin/mscgen_js -T png samples/coolchart.mscgen
node bin/mscgen_js -T png -n lazy samples/recaptcha-integration.msgenny
node bin/mscgen_js -T png -v above -o samples/vertical-align-above.png samples/vertical-align.msgenny
node bin/mscgen_js -T png -v middle -o samples/vertical-align-middle.png samples/vertical-align.msgenny
node bin/mscgen_js -T png -n lazy samples/bigandhonking.xu

node bin/mscgen_js -T svg -n lazy samples/autoscale.msgenny
node bin/mscgen_js -T svg -n lazy samples/cheat-sheet-wide.msgenny
node bin/mscgen_js -T svg -n lazy samples/coolchart.mscgen
node bin/mscgen_js -T svg -n lazy samples/recaptcha-integration.msgenny
node bin/mscgen_js -T svg -n lazy samples/bigandhonking.xu
