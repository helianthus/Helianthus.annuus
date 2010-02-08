document.domain = 'hkgolden.com';

$d.bind('click', function(event)
{
	var jTarget = $(event.target).closest('a');
	if(jTarget.length && /^(?:#|javascript:)$/.test(jTarget.attr('href'))) event.preventDefault();
});

$.rules('\
a > img { border: 0; } \
.TransparentGrayBackground, .TransparentGrayBackground + * { z-index: 10; } \
');

$.timeout('checkdom', function()
{
	document.getElementById('Side_GoogleAd') ? $.ready() : $.timeout('checkdom', 50);
});

$.ajaxSetup({ cache: false });

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