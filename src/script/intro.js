(function()
{

if(window.jQuery) throw 'jQuery already exists! Probably caused by duplicate script injection.';

if(/\.(?:gif|jpe?g|png|asmx)\b/i.test(location.href)) return;

var
jQuery, $, $d, $j,
an = {
	version: '${AN_VERSION}',
	plugins: {}
};

// expose
window.an = an;