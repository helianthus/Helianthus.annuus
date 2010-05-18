document.domain = 'hkgolden.com';

$.ajaxSetup({ cache: false });

$(document).click(function(event)
{
	if(/^(?:#|javascript:)$/.test($(event.target).closest('a').attr('href'))) {
		event.preventDefault();
	}
});

// interestingly Gecko only fires click event for middle click when target is document
// while Webkit always fires no matter what the target is
// other browsers in contrast never fires for middle click
//
// so we block middle click on click event for consistency
$.event.special.click = {
	add: function(details)
	{
		var handler = details.handler;
		details.handler = function(event)
		{
			if(event.which === 1) {
				handler.apply(this, arguments);
			}
		};
	}
};

$('<div />', { id: 'an' }).appendTo(document.documentElement);
