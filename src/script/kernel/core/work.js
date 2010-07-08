bolanderi.get('RUN_AT_TYPES', ['window_start', 'document_start', 'document_end', 'window_end']);

bolanderi.work = function(context)
{
	bolanderi.__context = $(context);

	$.event.trigger('work', context);

	if(!bolanderi.get('DOCUMENT_STARTED')) {
		bolanderi.get('WINDOW_STARTED', true);
		bolanderi.get('DOCUMENT_STARTED', true);
		$.each(bolanderi.get('RUN_AT_TYPES'), function(i, type)
		{
			bolanderi.ready(type, function()
			{
				$.event.trigger('work_' + type);
			});
		});
	}
};

bolanderi.ready = function(type, callback)
{
	if($.checkIf.unknown(type, bolanderi.get('RUN_AT_TYPES'), 'bolanderi.ready()')) {
		return;
	}

	if(bolanderi.get(type.concat('ed').toUpperCase())) {
		callback(type);
	}
	else {
		$(document).one(type, function()
		{
			callback(type);
		});
	}
};

(function()
{
	var documentEnd = function()
	{
		$.timeout('checkDOM', null);
		bolanderi.get('DOCUMENT_ENDED', true);
		$.event.trigger('document_end');
	};

	$(document).one('kernel_ready', function()
	{
		$.timeout('checkDOM', function()
		{
			if($.isReady || $('#Side_GoogleAd').length) {
				documentEnd();
			}
			else {
				$.timeout('checkDOM', 50);
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
