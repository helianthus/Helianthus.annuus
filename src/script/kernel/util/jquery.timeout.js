(function($)
{
	var cache = {};

	function proxy(id, callback, args)
	{
		return function()
		{
			if(id) {
				cache[id].destory = true;
			}

			callback.apply(null, args);

			if(id && cache[id] && cache[id].destory) {
				delete cache[id];
			}
		};
	}

	// $.timeout(id);
	// $.timeout(id, null);
	// $.timeout(id, args);
	// $.timeout(id, callback);
	// $.timeout(id, callback, args);
	// $.timeout(id, delay);
	// $.timeout(id, delay, args);
	// $.timeout(id, delay, callback);
	// $.timeout(id, delay, callback, args);
	// $.timeout(delay, callback);
	// $.timeout(delay, callback, args);
	// $.timeout(callback);
	// $.timeout(callback, args);

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
		var callback = $.isFunction(args[0]) ? args.shift() : cache[id].callback;
		var timer = setTimeout(proxy(id, callback, args[0]), delay);

		if(id) {
			cache[id] = {
				delay: delay,
				callback: callback,
				timer: timer
			};
		}
	};
})(jQuery);
