/*!
 * jQuery Rules Plugin
 * Copyright (c) 2010 project.helianthus <http://github.com/helianthus>
 * Licensed under the MIT License. <http://www.opensource.org/licenses/mit-license.php>
 *
 * version: 1.0.0pre
 * requires: jquery.format.js
 */

(function($)
{

var modified;
var cache = false;
var cssData = {
	pre: {
		map: { __anonymous: 0 },
		stack: ['']
	},
	post: {
		map: { __anonymous: 0 },
		stack: ['']
	}
};

$.rules = function(callback)
{
	if($.isFunction(callback)) {
		if(cache) {
			callback();
			return;
		}

		cache = true;
		modified = false;
		callback();
		if(modified) {
			write();
		}
		cache = false;

		return;
	}

	modified = true;
	var args = [].slice.call(arguments);
	var options = { position: 'post' };
	if(typeof args[0] !== 'string') {
		$.extend(options, args.shift());
	}

	if(!(options.position in cssData)) {
		throw Error('unknown position "{0}" found.', options.position);
	}

	var data = cssData[options.position];
	var map = data.map;
	var stack = data.stack;
	var css = compile(args);

	if(options.id) {
		if(options.id in map) {
			stack[map[options.id]] = css;
		}
		else {
			map[options.id] = stack.push(css) - 1;
			map.__anonymous = stack.push('') - 1;
		}
	}
	else {
		stack[map.__anonymous] += css;
	}

	if(!cache) {
		write();
	}
};

var styles;
var name = typeof bolanderi !== undefined ? '@PROJECT_NAME_SHORT@' : 'jquery-rules';

function write()
{
	$.each(styles || (styles = {
		pre: $($.format('<style id="{0}-style-pre" />', name)).prependTo('head'),
		post: $($.format('<style id="{0}-style-post" />', name)).appendTo('head')
	}), function(pos, style)
	{
		var css = cssData[pos].stack.join('');

		if(style[0].styleSheet) {
			style[0].styleSheet.cssText = css;
		}
		else {
			style.html(document.createTextNode(css));
		}
	});
}

var inconsistencies = [];
var alternatives = [];

function compile(params)
{
	return $.format(params)
	.replace(/\t+/g, '\n')
	.replace(/\[style.?="[^"]*"\]/g, function(styleSelector)
	{
		$.each(inconsistencies, function(i, fix)
		{
			styleSelector = ''.replace.apply(styleSelector, fix);
		});
		return styleSelector;
	})
	.replace(/{[^}]+/g, function(cssBlock)
	{
		$.each(alternatives, function(i, change)
		{
			cssBlock = ''.replace.apply(cssBlock, change);
		});

		if($.support.filter) {
			var rFilter = /-ms-filter: "([^"]+)"[; ]*/g;
			var filter, groupedFilters = [];
			while(filter = rFilter.exec(cssBlock)) {
				groupedFilters.push(filter[1]);
			}

			if(groupedFilters.length > 1) {
				cssBlock = cssBlock.replace(rFilter, '') + $.format(';-ms-filter: "{0}"; ', groupedFilters.join(' '));
			}
		}

		return cssBlock;
	});
}

(function()
{
	var testNode = document.createElement('div');
	testNode.innerHTML = '<div style="border-top: solid 1px blue; border-left: dashed; padding: 3px 3PX; COLor : #ffffff;" />';
	var cssTEXT = testNode.innerHTML.replace(/<div style="([^"]+).+/i, '$1');
	var csstext = cssTEXT.toLowerCase();
	var rWidth = /\d+\S+|thin|medium|thick/i;
	var rStyle = /none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset/i;

	$.each([
		// textIndented: IE, FF
		[csstext.indexOf('color:') !== -1, / *[:;](?![\]\"\']) */g, function($0)
		{
			return $.trim($0) + ' ';
		}],
		// colorConvertedToRGB: FF
		[csstext.indexOf('rgb(') !== -1, /#(\w+)/g, function($0, $1)
		{
			if($1.length === 3) {
				$1 = $.format('{0[0]:*2}{0[1]:*2}{0[2]:*2}', $1);
			}
			return $.format('rgb({0.substr(0,2)!x}, {0.substr(2,2)!x}, {0.substr(4,2)!x})', $1);
		}],
		[cssTEXT.indexOf('#FFFFFF') !== -1, /#(\w+)/g, function($0)
		{
			return $0.toUpperCase();
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
			var remains = $2;
			var ret = [];
			$.each([rWidth, rStyle], function(i, re)
			{
				remains = remains.replace(re, function(match)
				{
					ret.push(match);
					return '';
				});
			});
			return $1 + [$.trim(remains)].concat(ret).join(' ');
		}],
		// borderReordered_WSC: FF
		[csstext.indexOf(': 1px') !== -1, /(border(?:-(?:top|right|bottom|left))? *: *)([^;\"]+)/gi, function($0, $1, $2)
		{
			var remains = $2;
			var ret = [];
			$.each([rWidth, rStyle], function(i, re)
			{
				remains = remains.replace(re, function(match)
				{
					ret.push(match);
					return '';
				});
			});
			return $1 + ret.concat($.trim(remains)).join(' ');
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
		[csstext.slice(-1) !== ';', /;\"/, '"'],
		// endSemiColonAdded: FF
		[$('<div style="color: #000"/>')[0].style.cssText.slice(-1) === ';', /(style=\"[^\"]+[^;])\"/, '$1;"']
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
			return $0.charAt(1).toUpperCase();
		});
	};
	var prefixes = ['', 'Moz', 'O', 'Webkit', 'Khtml'];

	$.each(['background-size', 'border-radius', 'box-shadow', 'box-sizing', 'text-overflow', 'transform', 'transition'], function(i, property)
	{
		$.each(prefixes, function(j, prefix)
		{
			if(typeof testStyle[toCamel($.format('{0}-{1}', prefix, property))] !== 'undefined') {
				if(j !== 0) {
					alternatives.push([new RegExp(property, 'gi'), $.format('-{0}-$&', prefix.toLowerCase())]);
				}
				return false;
			}
		});
	});

	$.each(prefixes, function(j, prefix)
	{
		if(typeof testStyle[prefix + 'BorderRadiusTopleft'] !== 'undefined') {
			alternatives.push([/border-([a-z]+-[a-z]+)-radius/gi, function($0, $1)
			{
				return $.format('-{0}-border-radius-{1}', prefix.toLowerCase(), $1.replace(/-/, ''));
			}]);
			return false;
		}
	});

	$.support.filter = typeof document.createElement('div').filters !== 'undefined';

	if($.support.filter) {
		alternatives.push(
			[/background-color *: *rgba\( *(\d+), *(\d+), *(\d+), *([.\d]+) *\)[; ]*/i, function($0, $1, $2, $3, $4)
			{
				return $.format('-ms-filter: "progid:DXImageTransform.Microsoft.Gradient(startColorStr=#{0},EndColorStr=#{0});"', $.format('{0:x}{1:x}{2:x}{3:x}', $4 * 255, $1, $2, $3));
			}],
			[/opacity *:([^;]+)[; ]*/i, function($0, $1)
			{
				return $.format('-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(opacity={0});"', $1 * 100);
			}],
			[/transform *: *rotate\(([^)]+)\)[; ]*/i, function($0, $1)
			{
				var rad = parseInt($1, 10) * Math.PI / 180;
				return $.format('-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11={0},M12={1!-},M21={1},M22={0},sizingMethod=\'auto expand\')";', Math.cos(rad), Math.sin(rad));
			}]
		);
	}
})();

})(jQuery);
