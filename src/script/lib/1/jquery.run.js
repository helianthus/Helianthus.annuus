/*!
 * jQuery Run Plugin
 * Copyright (c) 2010 project.helianthus <http://github.com/helianthus>
 * Licensed under the MIT License. <http://www.opensource.org/licenses/mit-license.php>
 *
 * version: 1.0.0pre
 */

(function($)
{
	function isArrayLike(target)
	{
		return !!target && ($.isArray(target) || typeof target.callee === 'function' && typeof target.length === 'number');
	}

	var cache = {};
	var typeMap = {
		'boolean': 'clear',
		'function': 'fn',
		number: 'delay',
		string: 'id'
	};

	$.run = function()
	{
		var options = {};

		$.each(arguments, function(i, arg)
		{
			var type = typeof arg;

			if(arg === null) {
				options.clear = true;
			}
			else if(type !== 'object') {
				options[typeMap[type]] = arg;
			}
			else if(isArrayLike(arg)) {
				options.params = arg;
			}
			else if($.isPlainObject(arg)) {
				$.extend(options, arg);
			}
		});

		if('id' in options) {
			if(options.id in cache) {
				clearTimeout(cache[options.id].timer);
				options = $.extend(cache[options.id], options);
			}

			if(options.clear) {
				delete cache[options.id];
				return;
			}
		}
		else {
			options.id = $.now();
		}

		if(!options.fn) {
			throw Error('jQuery.run: function is missing!');
		}

		cache[options.id] = options;
		options.destroy = false;

		var fn = function()
		{
			options.destroy = true;

			options.fn.apply(options, options.params);

			if(options.id in cache && cache[options.id].destroy) {
				delete cache[options.id];
			}
		};

		if(typeof options.delay !== 'number') {
			fn();
		}
		else {
			options.timer = setTimeout(fn, options.delay);
		}

		return options;
	};
})(jQuery);
