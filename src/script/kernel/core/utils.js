$.extend(bolanderi, {
	doc: $(document),

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
					return bolanderi.pageCode() & obj;
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
		bolanderi.trigger('log', [type, msg]);

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
			'private': [profile, 'privateData', module.id, module._pageCode, dataType]
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

	pageCode: function(context)
	{
		context = $.$(context || bolanderi.doc);

		return $.memoize(context, 'pageCode', function()
		{
			var pageName = bolanderi.pageName(context);

			for(var code in bolanderi.get('PAGES')) {
				if(bolanderi.get('PAGES')[code].name === pageName) {
					return +code;
				}
			}

			return 0;
		});
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
			bolanderi.one(type, callback);
		}
	},

	trigger: function(type, params)
	{
		$.event.trigger('bolanderi_event', [type].concat(params));
		$.event.trigger.apply($.event, arguments);
	}
});

(function()
{
	$.each(['one', 'bind', 'bindAndRun', 'unbind', 'queue', 'dequeue'], function(i, name)
	{
		bolanderi[name] = function()
		{
			$.fn[name].apply(bolanderi.doc, arguments);
			return bolanderi;
		};
	});
})();