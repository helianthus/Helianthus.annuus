(function()
{
	var documentEnd = function()
	{
		$.run('checkDOM', null);
		bolanderi.get('DOCUMENT_ENDED', true);
		$.event.trigger('document_end');
	};

	$(document).one('kernel_ready', function()
	{
		$.run('checkDOM', function()
		{
			if($.isReady || $('#Side_GoogleAd').length) {
				documentEnd();
			}
			else {
				$.run('checkDOM', 50);
			}
		});
	});

	$(window).one('load', function()
	{
		if(!bolanderi.get('DOCUMENT_ENDED')) {
			documentEnd();
		}
		setTimeout(function()
		{
			bolanderi.get('WINDOW_ENDED', true);
			$.event.trigger('window_end');
		}, 0);
	});
})();
