(function()
{

var window = typeof unsafeWindow != 'undefined' ? unsafeWindow : this;
var document = window.document;
var navigator = window.navigator;
var JSON = window.JSON || {};
var jQuery, $;
var AN = window.AN = { mod: {}, version: '${AN_VERSION}' };

if(document.body && document.body.firstChild.className == 'webkit-line-gutter-backdrop') return;

document.domain = 'hkgolden.com';