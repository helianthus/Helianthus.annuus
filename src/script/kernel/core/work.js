bolanderi.work = function(context)
{
	$(bolanderi).trigger('workstart', context);
	bolanderi.__context = $(context);

	var groups = bolanderi.__execGroups;

	groups(0);

	$(bolanderi).trigger('document_start');

	groups('document_start');

	$(bolanderi).one('document_end', function()
	{
		groups('document_end');

		$(bolanderi).one('window_loaded', function()
		{
			groups('window_loaded');
			$(bolanderi).trigger('workend', context);
		});

		if(bolanderi.get('WINDOW_IS_LOADED')) {
			$(bolanderi).trigger('window_loaded');
		}
	});

	if(bolanderi.get('DOM_IS_READY')) {
		$(bolanderi).trigger('document_end');
	}
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
