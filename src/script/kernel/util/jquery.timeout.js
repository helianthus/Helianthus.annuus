(function($)
{
	var cache = {};

	$.timeout = function()
	{
		var id;
		var args = $.slice(arguments);

		if(typeof args[0] === 'string') {
			id = args.shift();

			if(cache[id]) {
				clearTimeout(cache[id].timer);

				if(args[0] === null) {
					delete cache[id];
					return;
				}
			}
		}

		var delay = typeof args[0] === 'number' ? args.shift() : id && cache[id] && cache[id].delay || 0;
		var params = $.isArray(args[0]) ? args.shift() : [];
		var callback = args[0] || cache[id].callback;

		var timer = setTimeout(function()
		{
			if(id) {
				cache[id].destory = true;
			}

			callback.apply(null, params);

			if(id && cache[id] && cache[id].destory) {
				delete cache[id];
			}
		}, delay);

		if(id) {
			cache[id] = {
				delay: delay,
				callback: callback,
				timer: timer
			};
		}
	};
})(jQuery);
