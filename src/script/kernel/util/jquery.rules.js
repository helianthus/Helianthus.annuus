(function($)
{

var jStyle, cache = [];

function writeCSS(css, isOverWrite)
{
	if(!jStyle) jStyle = $('<style />').appendTo('#an');

	if(jStyle[0].styleSheet) {
		isOverWrite ? jStyle[0].styleSheet.cssText = css : jStyle[0].styleSheet.cssText += css;
	}
	else {
		jStyle[isOverWrite ? 'html' : 'append'](document.createTextNode(css));
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

var inconsistencies = [];
var alternatives = [];

$.rules = function()
{
	var css = $.format.apply(null, arguments).replace(/\t+/g, '\n');

	css = css.replace(/\[style.?="[^"]*"\]/g, function(styleSelector)
	{
		$.each(inconsistencies, function(i, fix)
		{
			styleSelector = ''.replace.apply(styleSelector, fix);
		});
		return styleSelector;
	});

	css = css.replace(/{[^}]+/g, function(cssBlock)
	{
		$.each(alternatives, function(i, change)
		{
			cssBlock = ''.replace.apply(cssBlock, change);
		});

		if($.support.filter) {
			var rFilter = /-ms-filter: "([^"]+)"; */g;
			var filter, groupedFilters = [];
			while(filter = rFilter.exec(cssBlock)) {
				groupedFilters.push(filter[1]);
			}

			if(groupedFilters.length > 1) {
				cssBlock = cssBlock.replace(rFilter, '') + $.format('-ms-filter: "{0}"; ', groupedFilters.join(' '));
			}
		}

		return cssBlock;
	});

	cache ? cache.push(css) : writeCSS(css, false);
};

(function()
{
	var cssTEXT = $('<div/>').append('<div style="border-top: solid 1px blue; border-left: dashed; padding: 3px 3PX; COLor : #000;" />').html().replace(/<div style="([^"]+).+/i, '$1');
	var csstext = cssTEXT.toLowerCase();
	var rWidth = /\d+\S+|thin|medium|thick/i;
	var rStyle = /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/i;

	$.each([
		// textIndented: IE, FF
		[csstext.indexOf('color:') !== -1, / +[:;\"] +/g, function($0)
		{
			var trimmed = $.trim($0);
			return trimmed === ':' ? ': ' : trimmed;
		}],
		// colorConvertedToRGB: FF
		[csstext.indexOf('rgb(') !== -1, /#(\d+)/g, function($0, $1)
		{
			if($1.length === 3) {
				$1 = $.format('{0[0]:*2}{0[1]:*2}{0[2]:*2}', $1);
			}
			return $.format('rgb({0}, {1}, {2})', parseInt($1.substr(0,2), 16), parseInt($1.substr(2,2), 16), parseInt($1.substr(4,2), 16));
		}],
		// borderAutofilled: FF
		[csstext.indexOf('medium') !== -1, /border(?:-(?:top|right|bottom|left))? *: *[^;\"]+/gi, function($0)
		{
			if(!rWidth.test($0)) {
				$0 += ' medium';
			}
			if(!rStyle.test($0)) {
				$0 += ' none';
			}
			return $0;
		}],
		// borderReordered_CWS: IE
		[csstext.indexOf(': blue') !== -1, /(border(?:-(?:top|right|bottom|left))? *: *)([^;\"]+)/gi, function($0, $1, $2)
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
		// borderReordered_WSC: FF
		[csstext.indexOf(': 1px') !== -1, /(border(?:-(?:top|right|bottom|left))? *: *)([^;\"]+)/gi, function($0, $1, $2)
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
		// paddingContracted: FF
		[csstext.indexOf('padding: 3px;') !== -1, /(padding *: *)([^;\"]+)/gi, function($0, $1, $2)
		{
			var values = $2.split(' ');
			while(values.length === 4 && values[1] === values[3] || values.length === 3 && values[0] === values[2] || values.length === 2 && values[0] === values[1]) {
				values.pop();
			}
			return $1 + values.join(' ');
		}],
		// paddingBorderExpanded: IE
		[csstext.indexOf('padding-top') !== -1, /.+?(padding|border) *: *([^;\"]+).+/gi, function($0, $1, $2)
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
		// selectorLowerCased: FF
		[cssTEXT.indexOf('color') !== -1, /[;\"][^:\]]+:/g, function($0)
		{
			return $0.toLowerCase();
		}],
		// selectorUpperCased: IE
		[cssTEXT.indexOf('COLOR') !== -1, /[;\"][^:\]]+:/g, function($0)
		{
			return $0.toUpperCase();
		}],
		// valuesLowerCased: IE, FF
		[cssTEXT.indexOf('3PX') === -1, /:[^;\"]+/g, function($0)
		{
			return $0.toLowerCase();
		}],
		// endSemiColonRemoved: IE
		[csstext.slice(-1) !== ';', /;\"/, '"']
	], function(i, set)
	{
		if(set.shift()) {
			inconsistencies.push(set);
		}
	});
})();

(function()
{
	var testStyle = $('<div style="color: rgba(1,1,1,0.5)" />')[0].style;
	var toCamel = function(target)
	{
		return target.replace(/-\w/g, function($0)
		{
			return $0[1].toUpperCase();
		});
	};

	$.each(['border-radius', 'box-shadow', 'text-overflow'], function(i, property)
	{
		$.each(['Khtml', 'Moz', 'O', 'Webkit'], function(j, prefix)
		{
			if(typeof testStyle[prefix + toCamel(property)] !== 'undefined') {
				alternatives.push([new RegExp($.format('{0}(?!-)', property), 'g'), $.format('-{0}-{1}', prefix.toLowerCase(), property)]);
				return false;
			}
		});
	});

	$.support.filter = typeof testStyle.filter !== 'undefined';

	if($.support.filter) {
		$.each([
			[testStyle.cssText.toLowerCase().indexOf('rgba') === -1, /background-color *: *rgba\( *([.\d]+), *([.\d]+), *([.\d]+), *([.\d]+) *;\)/, function($0, $1, $2, $3, $4)
			{
				return $.format('-ms-filter: "progid:DXImageTransform.Microsoft.Gradient(startColorStr=#{0},EndColorStr=#{0});"', $.format('{0:x}{1:x}{2:x}{3:x}', $4 * 255, $1, $2, $3));
			}],
			[typeof testStyle.opacity === 'undefined', /opacity *:([^;]+);/, function($0)
			{
				return $.format('-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(opacity={0});"', $0 * 100);
			}]
		], function(i, set)
		{
			if(set.shift()) {
				alternatives.push(set);
			}
		});
	}
})();

})(jQuery);
