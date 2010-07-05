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
		if(bolanderi.get('DEBUG_MODE')) {
			if(window.console) {
				// webkit throws error with this
				// (console.debug || console.log)(...)
				console[console.debug ? 'debug' : 'log'](arguments.length === 1 ? arguments[0] : arguments);
			}
			else {
				$.timeout(100, [].slice.call(arguments), $.debug);
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

		if(type === 'debug' && !bolanderi.get('DEBUG_MODE')) {
			return;
		}

		var msg = $.format([].slice.call(arguments, 1));

		$.make($.log, 'archives', []).push([type, msg]);
		$(bolanderi).trigger('log', [type, msg]);

		if(type === 'log') {
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
