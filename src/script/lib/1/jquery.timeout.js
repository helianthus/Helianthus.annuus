/*!
 * jQuery Timeout Plugin
 * Copyright (c) 2010 project.helianthus <http://github.com/helianthus>
 * Licensed under the MIT License. <http://www.opensource.org/licenses/mit-license.php>
 *
 * version: 1.0.0
 */

(function($)
{
	var cache = {};

	function isArrayLike(target)
	{
		return !!target && ($.isArray(target) || typeof target.callee === 'function' && typeof target.length === 'number');
	}

	$.timeout = function()
	{
		var id;
		var args = [].slice.call(arguments);

		if(typeof args[0] === 'string') {
			id = args.shift();

			if(cache[id]) {
				clearTimeout(cache[id].timer);
			}

			if(args[0] === null && args.length === 1) {
				delete cache[id];
				return;
			}
		}

		var delay = typeof args[0] === 'number' || args[0] === null ? args.shift() : id && cache[id] && cache[id].delay;
		var params = isArrayLike(args[0]) ? args.shift() : [];
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
