bolanderi.get('RUN_AT_TYPES', ['window_start', 'document_start', 'document_end', 'window_end']);
bolanderi.get('WINDOW_STARTED', true);

bolanderi.work = function(context)
{
	$.event.trigger('work', (bolanderi.__context = $(context)));

	if(!bolanderi.get('DOCUMENT_STARTED')) {
		bolanderi.get('DOCUMENT_STARTED', true);
		$.event.trigger('document_start');
	}
};

bolanderi.inCondition = function(target)
{
	return $.all(target.condition, function(name, obj)
	{
		switch(name) {
			case 'is':
				return obj;
			case 'options':
				return $.all(obj, function(name, obj)
				{
					return $.test(obj, target instanceof bolanderi.Job ? target.options(name) : bolanderi.__moduleData('options', name));
				});
			case 'test':
				return obj(target);
			break;
		}
	});
};

bolanderi.info = function()
{
	return $.first(arguments, function(i, obj)
	{
		return obj == null || typeof obj === 'string' ? obj : obj instanceof bolanderi.Job ? obj.info() : obj.title || obj.id;
	}) || 'unknown';
};

bolanderi.ready = function(type, callback)
{
	if($.checkIf.unknown(type, bolanderi.get('RUN_AT_TYPES'), 'bolanderi.ready()')) {
		return;
	}

	if(bolanderi.get(type.concat('ed').toUpperCase())) {
		callback();
	}
	else {
		$(document).one(type, function()
		{
			callback();
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
