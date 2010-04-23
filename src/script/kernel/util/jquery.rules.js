(function($)
{

var node, cache = [];

function writeCSS(css, isOverWrite)
{
	if(!node) node = $('<style />').appendTo('#an')[0];

	if(node.styleSheet) {
		node.styleSheet.cssText = (isOverWrite ? '' : node.styleSheet.cssText) + css;
	}
	else {
		$(node)[isOverWrite ? 'html' : 'append'](document.createTextNode(css));
	}
}

$(bolanderi).bind('groupend', function(event, groupNo)
{
	if(groupNo === 3) {
		writeCSS(cache.join(''));
		$(bolanderi).unbind(event);
		cache = null;
	}
});

var inconsistencies = (function()
{
	var cssTEXT = $('<div/>').append('<div style="border-top: solid 1px blue; border-left: dashed; padding: 3px 3PX; COLor : #000;" />').html().replace(/<div style="([^"]+).+/i, '$1');
	var csstext = cssTEXT.toLowerCase();
	var rWidth = /\d+\S+|thin|medium|thick/i;
	var rStyle = /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/i;

	return {
		// IE, FF
		textIndented: csstext.indexOf('color:') !== -1 && [/ +[:;\"] +/g, function($0)
		{
			var trimmed = $.trim($0);
			return trimmed === ':' ? ': ' : trimmed;
		}],
		// FF
		colorConvertedToRGB: csstext.indexOf('rgb(') !== -1 && [/#(\d+)/g, function($0, $1)
		{
			if($1.length === 3) {
				$1 = $.format('{0[0]!*2}{0[1]!*2}{0[2]!*2}', $1);
			}
			return $.format('rgb({0}, {1}, {2})', parseInt($1.substr(0,2), 16), parseInt($1.substr(2,2), 16), parseInt($1.substr(4,2), 16));
		}],
		// FF
		borderAutofilled: csstext.indexOf('medium') !== -1 && [/border(?:-(?:top|right|bottom|left))? *: *[^;\"]+/gi, function($0)
		{
			if(!rWidth.test($0)) {
				$0 += ' medium';
			}
			if(!rStyle.test($0)) {
				$0 += ' none';
			}
			return $0;
		}],
		// IE
		borderReordered_CWS: csstext.indexOf(': blue') !== -1 && [/(border(?:-(?:top|right|bottom|left))? *: *)([^;\"]+)/gi, function($0, $1, $2)
		{
			var values = $2.split(' ');
			$.each(values, function(i, value)
			{
				// width
				if(rWidth.test(value)) {
					// do nth
				}
				// style
				else if(rStyle.test(value)) {
					values.push(values.splice(i, 1)[0]);
				}
				// color
				else {
					values.shift(values.splice(i, 1)[0]);
				}
			});
			return $1 + values.join(' ');
		}],
		// FF
		borderReordered_WSC: csstext.indexOf(': 1px') !== -1 && [/(border(?:-(?:top|right|bottom|left))? *: *)([^;\"]+)/gi, function($0, $1, $2)
		{
			var values = $2.split(' ');
			$.each(values, function(i, value)
			{
				// width
				if(rWidth.test(value)) {
					values.shift(values.splice(i, 1)[0]);
				}
				// style
				else if(rStyle.test(value)) {
					// do nth
				}
				// color
				else {
					values.push(values.splice(i, 1)[0]);
				}
			});
			return $1 + values.join(' ');
		}],
		// FF
		paddingContracted: csstext.indexOf('padding: 3px;') !== -1 && [/(padding *: *)([^;\"]+)/gi, function($0, $1, $2)
		{
			var values = $2.split(' ');
			while(values.length === 4 && values[1] === values[3] || values.length === 3 && values[0] === values[2] || values.length === 2 && values[0] === values[1]) {
				values.pop();
			}
			return $1 + values.join(' ');
		}],
		// IE
		paddingBorderExpanded: csstext.indexOf('padding-top') !== -1 && [/.+?(padding|border) *: *([^;\"]+).+/gi, function($0, $1, $2)
		{
			var ret = '';
			var sides = ['top', 'right', 'bottom', 'left'];

			if($1.toLowerCase() === 'padding') {
				var values = $2.split(' ');
				while(values.length !== 4) {
					values.push(values[values.length <= 2 ? 0 : 1]);
				}
				$.each(sides, function(i, side)
				{
					ret += $.format('[style*="padding-{0}: {1}"]', side, values[i]);
				});
			}
			else {
				$.each(sides, function(i, side)
				{
					ret += $.format('[style*="border-{0}: {1}"]', side, $2);
				});
			}
			return ret;
		}],
		// FF
		selectorLowerCased: cssTEXT.indexOf('color') !== -1 && [/[;\"][^:\]]+:/g, function($0)
		{
			return $0.toLowerCase();
		}],
		// IE
		selectorUpperCased: cssTEXT.indexOf('COLOR') !== -1 && [/[;\"][^:\]]+:/g, function($0)
		{
			return $0.toUpperCase();
		}],
		// IE, FF
		valuesLowerCased: cssTEXT.indexOf('3PX') === -1 && [/:[^;\"]+/g, function($0)
		{
			return $0.toLowerCase();
		}],
		// IE
		endSemiColonRemoved: csstext.slice(-1) !== ';' && [/;\"/, '"']
	};
})();

var vendorPrefixes = {};

(function()
{
	var testStyle = document.createElement('div').style;

	$.each(['border-radius', 'box-shadow'], function(i, property)
	{
		var camel = property.replace(/-\w/, function($0)
		{
			return $0[1].toUpperCase();
		})

		$.each(['Moz', 'O', 'Webkit'], function(j, prefix)
		{
			if(typeof testStyle[prefix + camel] !== 'undefined') {
				vendorPrefixes[property] = prefix;
				return false;
			}
		});
	});
})();

var filters = typeof document.createElement('div').style.filter !== 'undefined' && {
	rgba: !Modernizr.rgba && [/background-color *: *rgba\( *([.\d]+), *([.\d]+), *([.\d]+), *([.\d]+) *;\)/, function($0, $1, $2, $3, $4)
	{
		return $.format('-ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorStr=#{0},EndColorStr=#{0});"', $.format('{0:x}{1:x}{2:x}{3:x}', $4 * 255, $1, $2, $3));
	}],
	opacity: !Modernizr.opacity && [/opacity *:([^;]+);/, function($0)
	{
		return $.format('-ms-filter: "progid:DXImageTransform.Microsoft.alpha(opacity={0});"', Number($0) * 100);
	}]
};

$.rules = function()
{
	var css = $.format.apply(null, arguments).replace(/\t+/g, '\n');

	css = css.replace(/\[style.?="[^"]*"\]/g, function(styleSelector)
	{
		$.each(inconsistencies, function(name, fix)
		{
			if(fix) {
				styleSelector = ''.replace.apply(styleSelector, fix);
			}
		});
		return styleSelector;
	});

	css = css.replace(/{[^}]+/g, function(cssBlock)
	{
		if(filters) {
			$.each(filters, function(property, converter)
			{
				if(converter) {
					cssBlock = ''.replace.apply(cssBlock, converter);
				}
			});

			var rFilter = /-ms-filter: "([^"]+)"; */g;
			var filter, groupedFilters = [];
			while(filter = rFilter.exec(cssBlock)) {
				groupedFilters.push(filter[1]);
			}

			if(groupedFilters.length > 1) {
				cssBlock = cssBlock.replace(rFilter, '') + $.format('-ms-filter: "{0}"; ', groupedFilters.join(' '));
			}
		}

		$.each(vendorPrefixes, function(property, prefix)
		{
			cssBlock = cssBlock.replace(property, prefix + '$&');
		});

		return cssBlock;
	});

	cache ? cache.push(css) : writeCSS(css, false);
};

})(jQuery);
