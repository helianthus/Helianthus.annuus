document.domain = 'hkgolden.com';

$.ajaxSetup({ cache: false });

$d.bind('click', function(event)
{
	var jTarget = $(event.target).closest('a');
	if(jTarget.length && /^(?:#|javascript:)$/.test(jTarget.attr('href'))) event.preventDefault();
});

$(function()
{
	$('script').empty().each(function()
	{
		this.removeAttribute('src');
	});
});

$.rules('\
a > img { border: 0; } \
.TransparentGrayBackground, .TransparentGrayBackground + * { z-index: 10; } \
');

an.storageMode = window.localStorage && $.cookie('an-storagemode') === 'DOM' ? 'DOM' : 'Flash';