(function($)
{
	var
	convertors = {
		'*': function(target, val)
		{
			if($.isNumber(target)) {
				target *= val;
			}
			else if(typeof target === 'string') {
				var tmp = target;
				for(var i=1; i<val; ++i) {
					target += tmp;
				}
			}

			return target;
		},
		'|': function(target, val){ return $.isWord(target) ? target : val; }
	},
	formatters = {
		'x': function(target){ return $.isNumber(target) ? (target * 1).toString(16) : target; }
	};

	$.format = function(target)
	{
		if(arguments.length === 1) return target;

		var args = $.slice(arguments, 1);

		return target.replace(/{(\d+)((?:[[.][^[.!:}]+)*)(?:!([^:}]+))?(?::([^}]+))?}/g, function($0, index, props, convert, format)
		{
			var prop, replacement = args[index];

			if(props) {
				props = props.match(/[[.][^[.]+/g);
				while(replacement && props.length) {
					prop = props.shift().match(/[[.]([^\](]+)]?(\(([^)]*))?/);

					if(prop[2]) {
						replacement = replacement[prop[1]].apply(replacement, prop[3].split(','));
					}
					else {
						replacement = replacement[prop[1]];
					}
				}
			}
			if(convert) replacement = convertors[convert[0]](replacement, convert.substr(1));
			if(format) replacement = formatters[format[0]](replacement, format.substr(1));

			if(!$.isWord(replacement)) {
				!$.browser.msie && $.debug(an.curJob.plugin.desc, target, args);
				$.error('jQuery.format: replacement is not a word');
			}

			return replacement;
		});
	};
})(jQuery);