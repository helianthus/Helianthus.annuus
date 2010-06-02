(function($)
{
	var cache = {};

	$.timeout = function()
	{
		var id;
		var args = [].slice.call(arguments);

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

		var delay = typeof args[0] === 'number' || args[0] === false ? args.shift() : id && cache[id] && cache[id].delay;
		var params = $.isArray(args[0]) ? args.shift() : [];
		var callback = args[0] || cache[id].callback;

		if(id) {
			cache[id] = {
				delay: delay,
				callback: callback
			};
		}

		var fn = function()
		{
			if(id) {
				cache[id].destory = true;
			}

			callback.apply(null, params);

			if(id && cache[id] && cache[id].destory) {
				delete cache[id];
			}
		};

		if(typeof delay !== 'number') {
			fn();
		}
		else {
			var timer = setTimeout(fn, delay);

			if(id) {
				cache[id].timer = timer;
			}
		}
	};
})(jQuery);
