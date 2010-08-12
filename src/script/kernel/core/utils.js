bolanderi.get('RUN_AT_TYPES', ['window_start', 'document_start', 'document_end', 'window_end']);
bolanderi.get('WINDOW_STARTED', true);

$.extend(bolanderi, {
	context: function()
	{
		return bolanderi.__context;
	},

	error: function()
	{
		throw new Error($.format(arguments));
	},

	inCondition: function(target)
	{
		return $.all(target.condition, function(name, obj)
		{
			switch(name) {
				case 'is':
					return obj;
				case 'options':
					return $.all(obj, function(name, obj)
					{
						return $.test(obj, bolanderi.moduleData(target.module || target, 'options', name));
					});
				case 'page':
					return $(document).pageCode() & obj;
				case 'test':
					return 'module' in target && !(target instanceof bolanderi.Job) || obj(target);
				break;
			}
		});
	},

	info: function()
	{
		return $.first(arguments, function(i, obj)
		{
			return obj == null || typeof obj === 'string' ? obj : obj instanceof bolanderi.Job ? obj.info() : obj.title || obj.id;
		}) || 'unknown';
	},

	log: function(type)
	{
		if(!/debug|error|info|log|warn/.test(type)) {
			bolanderi.log('warn', 'unknown notification type "{0}" encountered, falls back to "log".', type);
			type = 'log';
		}

		var msg = $.format([].slice.call(arguments, 1));

		$.make(annuus.log, 'archives', []).push([type, msg, new Date()]);
		$.event.trigger('log', [type, msg]);

		if(type === 'log' || type === 'debug') {
			return;
		}

		msg = '[@PROJECT_NAME_SHORT@] ' + msg;

		if(window.console) {
			if(!console[type]) {
				type = 'log';
			}
			console[type](msg);
		}
	},

	moduleData: function(module, dataType, id, value)
	{
		var isGet = typeof id in { string:1, undefined:1 } && typeof value === 'undefined';
		var profile = bolanderi.storage.get({ mode: isGet ? 'mixed' : 'saved' });
		var paths = {
			'public': [profile, 'publicData', dataType],
			'protected': [profile, 'privateData', module.id, dataType],
			'private': [profile, 'privateData', module.id, module.__pageCode, dataType]
		};
		var data = {};

		if(isGet) {
			$.each(paths, function(modifier, path)
			{
				$.extend(data, $.dig(path));
			});
			return typeof id === 'undefined' ? data : data[id];
		}

		if(typeof id === 'string') {
			data[id] = value;
		}
		else {
			data = id;
		}

		$.each(data, function(id, value)
		{
			var dataDef = $.dig(module, dataType, id);

			if(dataType === 'options' && !dataDef && typeof $.dig(bolanderi.storage.get(), 'publicData', dataType, id) === 'undefined') {
				bolanderi.log('error', 'public option with id "{0}" does not exist. {1}', id, module.title);
				return;
			}

			var container = $.make.apply(null, paths[dataDef ? dataDef.access || 'protected' : 'public'].concat({}));

			if(value === null) {
				delete container[id];
			}
			else {
				container[id] = value;
			}
		});

		bolanderi.storage.save();
	},

	ready: function(type, callback)
	{
		if(bolanderi.checkIf.unknown(type, bolanderi.get('RUN_AT_TYPES'), 'bolanderi.ready()')) {
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
	},

	work: function(context)
	{
		$.event.trigger('work', (bolanderi.__context = $(context)));

		if(!bolanderi.get('DOCUMENT_STARTED')) {
			bolanderi.get('DOCUMENT_STARTED', true);
			$.each(bolanderi.get('RUN_AT_TYPES'), function(i, type)
			{
				$.event.trigger('work_' + type);
			});
		}
	}
});
