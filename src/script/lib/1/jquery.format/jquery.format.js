/*!
 * jQuery Format Plugin
 * Copyright (c) 2010 project.helianthus <http://github.com/helianthus>
 * Licensed under the MIT License. <http://www.opensource.org/licenses/mit-license.php>
 *
 * version: 1.0.0pre
 */

(function($)
{
	var radixes = { b:2, o:8, d: 10, x:16, X:16 };

	var converters = {
		's': function(target)
		{
			return target + '';
		},
		'-': function(target)
		{
			return -target;
		}
	};

	$.each(radixes, function(type, radix)
	{
		converters[type] = function(target)
		{
			return parseInt(target, radix);
		};
	});

	function isNumber(target)
	{
		return /^(?:string|number)$/.test(typeof target) && !isNaN(+target);
	}

	var formatters = function(target, format)
	{
		format.replace(/^(?:\*(\d+))?(?:(.)?([<>=^]))?([ +-])?(#)?(0)?(\d+)?(,)?(?:\.(\d+))?([bcdeEfgGFosxX%])?$/, function($0, repeat, fill, align, sign, _sharp, _0, width, _comma, precision, type)
		{
			var addSignAtLast = 0;

			var undefined;

			if(_0) {
				fill = '0';
				align = '=';
			}

			if(!type) {
				type = !isNumber(target) ? 's' : 'g';
			}

			if(type !== 's') {
				if(sign) {
					if(sign === '-') {
						sign = null;
					}
					else if(target < 0) {
						if(sign === ' ') {
							sign = '-';
						}
						else if(sign === '+') {
							target = -target;
						}
					}
				}

				if(/[bcdoxX]/.test(type)) {
					target = (+target).toFixed(0);

					if(type in radixes) {
						target = (+target).toString(radixes[type]);
					}
					else if(type === 'c') {
						target = String.fromCharCode(target);
					}
				}
				else {
					if(/e/i.test(type)) {
						target = isNumber(precision) ? target.toExponential() : target.toExponential(precision);
					}
					else {
						if(type === '%') {
							target = target * 100;
						}

						target = isNumber(precision) ? target.toFixed(precision) : target + '';

						if(type === '%') {
							target += '%';
						}
					}
				}

				if(/[A-Z]/.test(type)) {
					target = target.toUpperCase();
				}

				if(_comma) {
					target = target.split('.');
					target = target[0].replace(/\d{3}(?!$)/g, '$&,') + target[1];
				}

				if(sign) {
					if(align === '=') {
						align = '>';
						addSignAtLast = 1;
					}
					else {
						target = sign + target;
					}
				}
			}

			if(repeat) {
				var temp = target;
				for(var i=1; i<repeat; ++i) {
					target += temp;
				}
			}

			if(width && align) {
				var padding = (type === 's' && precision ? Math.min(width, precision) : width) - target.length - addSignAtLast;
				fill = fill || ' ';

				while(padding-- > 0) {
					if(align === '<' || align === '^' && padding % 2) {
						target += fill;
					}
					else {
						target = fill + target;
					}
				}
			}

			if(addSignAtLast) {
				target = sign + target;
			}
		});

		return target;
	};

	$.format = function(target)
	{
		if(arguments.length === 1) {
			return typeof target === 'string' ? target : $.format.apply($, target);
		}

		var args = [].slice.call(arguments, 1);

		return target.replace(/{(\d+)((?:[^{}]|(?:{\d[^{}]*}))*)}/g, function(field, index, mods)
		{
			var count = 0;
			do {
				var temp = mods;
				mods = $.format([mods].concat(args));

				if(++count === 10) {
					window.console && console.log(target, mods);
					throw Error('jQuery.format: too many recursions!');
				}
			}
			while(mods !== temp);

			return mods.replace(/((?:[[.][^[.|!:]+)*)(\|[^:!]*)?(?:!([^:]+))?(?::(.+))?/, function($0, props, alt, convert, format)
			{
				var replacement = /{\d/.test(args[index]) ? $.format([args[index]].concat(args)) : args[index];

				if(props) {
					$.each(props.replace(/(?:^[.[]|[\]\) ])/g, '').split(/[.[]/), function(i, prop)
					{
						prop = prop.split('(');
						if(prop.length === 2) {
							replacement = replacement[prop[0]].apply(replacement, prop[1].split(','));
						}
						else {
							replacement = replacement[prop[0]];
						}
					});
				}
				if(alt && !replacement) {
					replacement = alt.slice(1);
				}
				if(convert) {
					$.each(convert.split(''), function(i, converter)
					{
						if(converters[converter]) {
							replacement = converters[converter](replacement);
						}
					});
				}
				if(format) {
					replacement = formatters(replacement, format);
				}

				if(!/^(?:number|string)$/.test(typeof replacement)) {
					window.console && console.log(target, $0, replacement);
					throw Error('jQuery.format: replacement is not a string or number.');
				}

				return replacement;
			});
		});
	};
})(jQuery);
