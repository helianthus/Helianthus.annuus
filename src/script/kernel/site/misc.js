document.domain = 'hkgolden.com';

$.ajaxSetup({ cache: false });

// jQuery's event.which normalization is flawed
// fortunately event.button is always 0 for left click

$(document).click(function(event)
{
	var href = $(event.target).closest('a').attr('href');

	if(href in { '#':1, 'javascript:':1 }
	// this works for gecko and webkit only
	|| event.button !== 0 && /^javascript:/.test(href)
	) {
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
			if(event.button === 0) {
				handler.apply(this, arguments);
			}
		};
	}
};

// clear all script tags to prevent js re-execution
$(function()
{
	$('body').find('script').empty().removeAttr('src');
});
