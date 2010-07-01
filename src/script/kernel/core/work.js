$.fn.work = function()
{
	bolanderi.__context = $(this[0]);

	bolanderi.__execGroups(0);

	$(bolanderi).trigger('document_start');

	bolanderi.__execGroups('document_start');

	$(bolanderi).one('document_end', function()
	{
		bolanderi.__execGroups('document_end');

		$(bolanderi).one('window_loaded', function()
		{
			bolanderi.__execGroups('window_loaded');

			$.log('log', 'work() completed successfully.');
		});

		if(bolanderi.get('WINDOW_IS_LOADED')) {
			$(bolanderi).trigger('window_loaded');
		}
	});

	if(bolanderi.get('DOM_IS_READY')) {
		$(bolanderi).trigger('document_end');
	}

	return this;
};

$(bolanderi).one('kernelready', function()
{
	$.timeout('checkDOM', function()
	{
		if($.isReady || $('#Side_GoogleAd').length) {
			bolanderi.get('DOM_IS_READY', true);
			$(bolanderi).trigger('document_end');
		}
		else {
			$.timeout('checkDOM', 50);
		}
	});
});

$(window).one('load', function()
{
	setTimeout(function()
	{
		bolanderi.get('WINDOW_IS_LOADED', true);
		if(bolanderi.get('DOM_IS_READY')) {
			$(bolanderi).trigger('window_loaded');
		}
	}, 10);
});
