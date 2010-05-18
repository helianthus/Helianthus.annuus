document.domain = 'hkgolden.com';

$.ajaxSetup({ cache: false });

$(document).click(function(event)
{
	if(/^(?:#|javascript:)$/.test($(event.target).closest('a').attr('href'))) {
		event.preventDefault();
	}
});

$('<div />', { id: 'an' }).appendTo(document.documentElement);
