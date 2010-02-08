$('<div />', { id: 'an' }).prependTo(document.documentElement);

if(an.storageMode === 'DOM') {
	$d.trigger('init').an();
}
else {
	an.lso = $('<div />', { id: 'an-lso' }).appendTo('#an').toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.time() : ''))[0];

	$.timeout('init', function()
	{
		if(typeof an.lso.get === 'function') {
			$d.trigger('init').an();
		}
		else {
			$.timeout('init', 50);
		}
	});
}