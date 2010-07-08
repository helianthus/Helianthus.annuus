(function()
{

document.domain = 'hkgolden.com';

// jQuery's event.which normalization is flawed
// fortunately event.button is always 0 for left click
function checkForDummyHref(event)
{
	var href = $(event.target).closest('a').attr('href');

	if(href in { '#':1, 'javascript:':1, 'javascript:window.close()':1 }
	// this works for gecko and webkit only
	|| event.button !== 0 && /^javascript:/.test(href)
	) {
		event.preventDefault();
	}
}

$(document).click(function(event)
{
	checkForDummyHref(event);
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
			checkForDummyHref(event);

			if(event.button === 0) {
				handler.apply(this, arguments);
			}
		};
	}
};

// the best href I have found so far to avoid middle click to open a new tab
annuus.get('DUMMY_HREF', $.browser.opera && 'javascript:window.close()' || 'javascript:');

// clear all script tags to prevent js re-execution
$(function()
{
	// removeAttr somehow causes IE to re-fire window load event
	$('body').find('script').empty().each(function()
	{
		this.removeAttribute('src');
	});
});

})();
