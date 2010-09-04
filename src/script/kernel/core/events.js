bolanderi.get('RUN_AT_TYPES', ['window_start', 'document_start', 'document_end', 'window_end']);

$(document).one('jobs_ready', function()
{
	bolanderi.get('WINDOW_STARTED', true);
	bolanderi.trigger('window_start');

	bolanderi.get('DOCUMENT_STARTED', true);
	bolanderi.trigger('document_start');

	$.run(function()
	{
		if($.isReady || $('#Side_GoogleAd').length) {
			bolanderi.get('DOCUMENT_ENDED', true);
			bolanderi.trigger('document_end');
		}
		else {
			$.run(this, 50);
		}
	});
});

(function()
{
	var windowEnd = function()
	{
		setTimeout(function()
		{
			bolanderi.get('WINDOW_ENDED', true);
			bolanderi.trigger('window_end');
		}, 0);
	};

	$(window).one('load', function()
	{
		bolanderi.get('DOCUMENT_ENDED') ? windowEnd() : bolanderi.one('document_end', windowEnd);
	});
})();
