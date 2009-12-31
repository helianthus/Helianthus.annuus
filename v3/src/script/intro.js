(function()
{

var window = typeof unsafeWindow != 'undefined' ? unsafeWindow : this,
self = window,
parent = window.parent,
top = window.top,
document = window.document,
navigator = window.navigator,
console = window.console,
JSON = window.JSON || {},
jQuery, $, $d, $w,
AN = window.AN = { mod: {}, version: '${AN_VERSION}' };

if(document.body && document.body.firstChild.className == 'webkit-line-gutter-backdrop' || /\.(?:gif|jpe?g|png|asmx)$/i.test(location.href)) return;

document.domain = 'hkgolden.com';