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

		return target.replace(/{(\d+)((?:[^{}]|(?:{\d[^{}]*}))*)}/g, function(field, index, mods)
		{
			var count = 0;
			do {
				var temp = mods;
				mods = $.format.apply(null, [mods].concat(args));

				if(++count === 10) {
					$.debug(target, mods);
					$.err('jQuery.format: too many recursions!');
				}
			}
			while(mods !== temp);

			return mods.replace(/((?:[[.][^[.|!:]+)*)(?:\|([^:!]+))?(?:!([^:]))?(?::(.+))?/, function($0, props, alt, convert, format)
			{
				var replacement = args[index];

				if(props) {
					$.each(props.replace(/(?:^[.[]|[\]\) ])/g, '').split(/[.[]/), function(i, prop)
					{
						prop = prop.split('(');
						if(prop[1]) {
							replacement = replacement[prop[0]].apply(replacement, prop[1].split(','));
						}
						else {
							replacement = replacement[prop[0]];
						}
					});
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
					$.debug(target, $0);
					$.err('jQuery.format: replacement is not a string');
				}

				return replacement;
			});
		});
	};
})(jQuery);
