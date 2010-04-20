(function($)
{
	var
	/*rRule = /\S[^{]+{[^}]+}/g,*/
	node,
	cache = [];

	function writeCSS(css, isOverWrite)
	{
		if(!node) node = $('<style />').appendTo('#an')[0];

		if(node.styleSheet) {
			node.styleSheet.cssText = (isOverWrite ? '' : node.styleSheet.cssText) + css;
		}
		else {
			$(node)[isOverWrite ? 'html' : 'append'](document.createTextNode(css));
			/*
			var len = sheet.cssRules.length;
			$.each(css.match(rRule), function(i, rule) {
				sheet.insertRule(rule, len++);
			});
			*/
		}
	}

	$(an).bind('groupend', function(event, groupNo)
	{
		if(groupNo === 3) {
			writeCSS(cache.join(''));
			$(an).unbind(event);
			cache = null;
		}
	});

	$.rules = function(css, remove)
	{
		if(remove === null) {
			var newCSS = '';
			$.each(node.sheet && node.sheet.cssRules || node.styleSheet.rules, function(i, rule)
			{
				if(rule.selectorText !== css) {
					newCSS += $.format('{0}{{1}}', rule.selectorText, rule.style.cssText);
				}
			});
			writeCSS(newCSS, true);
		}
		else{
			if(arguments.length > 1) css = $.format.apply(null, arguments);
			cache ? cache.push(css) : writeCSS(css);
		}
	};
})(jQuery);