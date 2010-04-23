document.domain = 'hkgolden.com';

$.ajaxSetup({ cache: false });

$(document).delegate('a', 'click', function(event)
{
	if(/^(?:#|javascript:)$/.test(this.href)) {
		event.preventDefault();
	}
});

$('<div />', { id: 'an' }).prependTo(document.documentElement);
