an.addModules = function(getModules)
{
	$(an).one('kernelready', function(){ $.extend(an.get('MODULES', {}), getModules()); });
};

document.domain = 'hkgolden.com';

$.ajaxSetup({ cache: false });

$(document).delegate('a', 'click', function(event)
{
	if(/^(?:#|javascript:)$/.test(this.href)) {
		event.preventDefault();
	}
});

$('<div />', { id: 'an' }).prependTo(document.documentElement);

$(function()
{
	$('script').empty().each(function()
	{
		this.removeAttribute('src');
	});
});

$(an).one('kernelready', function()
{
	$.rules('\
	a > img { border: 0; } \
	.TransparentGrayBackground, .TransparentGrayBackground + * { z-index: 10; } \
	');
});