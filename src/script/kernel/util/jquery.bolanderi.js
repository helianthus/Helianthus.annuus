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
				console[console.debug ? 'debug' : 'log'](arguments.length === 1 ? arguments[0] : arguments);
			}
			else {
				alert($.slice(arguments).join(' '));
			}
		}
	},
	error: function(msg)
	{
		msg = '[@PROJECT_NAME_SHORT@] ' + msg;
		throw new Error($.format.apply(null, arguments));
	},
	log: function(type, msg)
	{
		if(!/debug|error|info|log|warn/.test(type)) {
			$.log('warn', 'unknown notification type "{0}" encountered, falls back to "log".', type);
			type = 'log';
		}

		if(type === 'debug' && !bolanderi.get('DEBUG_MODE')) {
			return;
		}

		msg = '[@PROJECT_NAME_SHORT@] ' + msg;
		msg = $.format.apply(null, $.slice(arguments, 1));

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
