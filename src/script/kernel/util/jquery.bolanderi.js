$.each({
	missing: {
		message: 'property "{0}" not found.',
		method: 'any',
		filter: function(target, name)
		{
			return !(name in target);
		}
	},
	exist: {
		message: 'property "{0}" already exists.',
		method: 'any',
		filter: function(target, name)
		{
			return name in target;
		}
	},
	unknown: {
		message: 'unknown value "{0}" encountered.',
		method: 'all',
		param: 'target',
		filter: function(target, value)
		{
			return target !== value;
		}
	},
	wrongType: {
		message: 'unsupported type "{0}" encountered.',
		method: 'all',
		filter: function(target, value)
		{
			if(value !== 'mixed') {
				switch(value) {
					case 'array': return !$.isArray(target);
					case 'function': return !$.isFunction(target);
					default: return typeof target !== value;
				}
			}
		}
	}
}, function(name, data)
{
	($.checkIf || ($.checkIf = {}))[name] = function(target, refs, info)
	{
		var val;
		var result = $[data.method]([].concat(refs), function(i, value)
		{
			val = data.param === 'target' ? target : value;
			return data.filter(target, value);
		});

		if(result) {
			info = info || target;
			$.log('error', '{0}{1|} [{2}]', $.format(data.message, val + ''), info instanceof bolanderi.Job && ' task dropped.', bolanderi.info(info));
		}

		return result;
	};
});

$.extend({
	doc: function(html)
	{
		return $('<div>' + html.replace(/^[\s\S]+?<form/, '<form').replace(/<\/form>\s*<!--[\s\S]+/, '</form>') + '</div>').eq(0);
	},
	getDoc: function(url, success, setup)
	{
		$.ajax((setup = {
			url: url,
			dataType: 'text',
			timeout: 10000,
			success: function(html)
			{
				var jDoc = $.doc(html);
				jDoc.pageCode() & 61438 ? success.call(setup, jDoc) : setup.error();
			},
			error: function()
			{
				$.run('log', '頁面讀取失敗, 5秒後重新讀取...');
				setTimeout(function(){ $.ajax(setup); }, 5000);
			}
		}));
	},

	debug: function()
	{
		$.log('debug', '$.debug: ' + [].slice.call(arguments).join(', '));

		if(bolanderi.get('DEBUG_MODE')) {
			if(window.console) {
				// webkit throws error with this
				// (console.debug || console.log)(...)
				console[console.debug ? 'debug' : 'log'](arguments.length === 1 ? arguments[0] : arguments);
			}
			else {
				$.timeout(100, arguments, $.debug);
			}
		}
	},
	error: function()
	{
		throw new Error($.format(arguments));
	},
	log: function(type)
	{
		if(!/debug|error|info|log|warn/.test(type)) {
			$.log('warn', 'unknown notification type "{0}" encountered, falls back to "log".', type);
			type = 'log';
		}

		var msg = $.format([].slice.call(arguments, 1));

		$.make($.log, 'archives', []).push([type, msg, new Date()]);
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
	}
});

$.fn.extend({
	pageNo: function()
	{
		return this.__pageNo || (this.__pageNo = +this.uriSet().querySet.page || 1);
	},

	debug: function()
	{
		$.debug(this);
		return this;
	}
});
