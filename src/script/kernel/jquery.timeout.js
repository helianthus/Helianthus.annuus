(function($)
{
	var cache = {};

	function proxy(id, fn, args)
	{
		return function()
		{
			cache[id].destory = true;
			fn.apply(null, args);
			if(cache[id] && cache[id].destory) delete cache[id];
		};
	}

	$.timeout = function(id, delay, callback)
	{
		if(cache[id]) {
			clearTimeout(cache[id].timer);
		}

		if(delay === null) {
			delete cache[id];
		}
		else {
			var args = callback === undefined ? null : $.slice(arguments, $.isFunction(callback) ? 3 : 2);

			if(delay === undefined) {
				delay = cache[id].delay;
			}
			else if($.isFunction(delay)) {
				callback = delay;
				delay = 0;
			}

			if(!$.isFunction(callback)) {
				callback = cache[id].callback;
			}

			cache[id] = {
				destory: false,
				delay: delay,
				callback: callback,
				timer: setTimeout(proxy(id, callback, args), delay)
			};
		}
	};
})(jQuery);