(function()
{

if(window.jQuery) throw 'jQuery already exists! Probably caused by duplicate script injection.';

if(/\.(?:gif|jpe?g|png|asmx)\b/i.test(location.href)) return;

var
disabled = -1, off = 0, on = 1, comp = 2,
once = 1, always = 2,
jQuery, $, $d, $j,
an = {
	version: '${AN_VERSION}',
	plugins: {}
};