document.domain = 'hkgolden.com';

$.event.special.click = {
	add: function(handler)
	{
		return function(event)
		{
			if(event.type === 'click' && !(event.data && event.data.disableCheck) && event.button > 0) return;
			handler.apply(this, arguments);
		};
	}
};

$.live('a', 'click', { disableCheck: true }, function(event)
{
	if(/^(?:#|javascript:)$/.test(this.href)) event.preventDefault();
});

/*
$.ajaxSetup(
{
	cache: false,
	contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
});
*/

$('<div />', { id: 'an' }).prependTo(document.documentElement);

an.storageMode = window.localStorage && $.cookie('an-storagemode') === 'DOM' ? 'DOM' : 'Flash';

if(an.storageMode === 'DOM') {
	$d.an();
}
else {
	an.lso = $('<div />', { id: 'an-lso' }).appendTo('#an').toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.time() : ''))[0];

	$.timeout('init', function()
	{
		if(typeof an.lso.get === 'function') {
			$d.an();
		}
		else {
			$.timeout('init', 50);
		}
	});
}