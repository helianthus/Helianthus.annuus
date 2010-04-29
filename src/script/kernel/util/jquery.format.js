(function($)
{
	var
	convertors = {
		's': function(target)
		{
			return target + '';
		},
		'n': function(target)
		{
			return target * 1;
		}
	},
	formatters = {
		'number': function(target, format)
		{
			if(format.toLowerCase() === 'x') {
				target = target.toString(16);
				if(format === 'X') {
					target = target.toUpperCase();
				}
			}
			return target;
		},
		'string': function(target, format)
		{
			if(format[0] === '*') {
				var temp = target;
				for(var i=1; i<format[1]; ++i) {
					target += temp;
				}
			}
			return target;
		}
	};

	$.format = function(target)
	{
		if(arguments.length === 1) return target;

		var args = $.slice(arguments, 1);

		return target.replace(/{(\d+)((?:[[.][^[.|!:}]+)*)(?:\|([^:!}]+))?(?:!([^:}]))?(?::([^}]+))?}/g, function($0, index, props, alt, convert, format)
		{
			var prop, replacement = args[index];

			if(props) {
				replacement = $.dig.apply(null, [].concat(replacement, props.split(/[.[\]]+/)));
			}
			if(alt && !replacement) {
				replacement = alt;
			}
			if(convert && convertors[convert]) {
				replacement = convertors[convert](replacement);
			}
			if(format && formatters[typeof replacement]) {
				replacement = formatters[typeof replacement](replacement, format);
			}

			if(!$.isWord(replacement)) {
				try {
					$.err('jQuery.format: replacement is not a string');
				}
				finally {
					$.debug(target, $0);
				}
			}

			return replacement;
		});
	};
})(jQuery);
