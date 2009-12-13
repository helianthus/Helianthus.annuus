(function()
{

var window, self, content = self = window = typeof unsafeWindow != 'undefined' ? unsafeWindow : this;
var parent = window.parent;
var top = window.top;
var document = window.document;
var navigator = window.navigator;
var console = window.console;
var JSON = window.JSON || {};
var jQuery, $;
var AN = window.AN = { mod: {}, version: '${AN_VERSION}' };

if(document.body && document.body.firstChild.className == 'webkit-line-gutter-backdrop' || /\.(?:gif|jpe?g|png|asmx)$/i.test(location.href)) return;

document.domain = 'hkgolden.com';