/*!
 * jQuery URL Plugin
 * Copyright (c) 2010 project.helianthus <http://github.com/helianthus>
 * Licensed under the MIT License. <http://www.opensource.org/licenses/mit-license.php>
 *
 * Partly based on parseUri by Steven Levithan <http://blog.stevenlevithan.com/archives/parseuri>
 *
 * version: 1.0.0pre
 * requires: jquery.format.js, jquery.deparam.js
 */

(function($)
{
	// as close as possible to the lastest standard: http://tools.ietf.org/html/rfc3986
	var keys = ['absolute','scheme','authority','userinfo','user','password','host','subdomain','domain','port','relative','path','directory','file','query','fragment'];
	var regex = RegExp([
		'^',
		'(?:([^:/?#]+):)?', // scheme
		'(?://(', // authority
			'(?:(', // userinfo
				'([^:/?#@]+)', // user
				'(?::',
					'([^@]*)', // password
				')?',
			')@)?',
			'(', // host
				'(?:',
					'((?:\\.?[^:/?#.]+)+)', // subdomain
				'\\.)?',
				'([^:/?#.]+\\.[^:/?#.]+)', // domain
			')',
			'(?::',
				'(\\d+)', // port
			')?',
		'))?',
		'(', // relative
			'(', // path
				'(/(?:[^/?#]+/)*)?', // directory
				'([^?#]*)', // file
			')?',
			'(?:\\?',
				'([^#]*)', // query
			')?',
			'(?:#',
				'(.*)', // fragment
			')?',
		')'
	].join(''));

	function clean(obj)
	{
		for(var key in obj) {
			if(obj[key] == null) {
				obj[key] = '';
			}
			else if(typeof obj[key] === 'object') {
				clean(obj[key]);
			}
		}

		return obj;
	}

	function parse(url)
	{
		var urlSet = {}, i = keys.length, arr = regex.exec(url);

		while(i--) {
			urlSet[keys[i]] = arr[i] || '';
		}

		return $.extend(urlSet, { querySet: $.deparam(/%u[a-fA-F\d]{4}/g.test(urlSet.query) ? unescape(urlSet.query).replace(/%/g, '%25') : urlSet.query), fragmentSet: $.deparam(urlSet.fragment) });
	}

	$.url = function(url, param)
	{
		if(typeof url !== 'string') {
			param = url;
			url = location.href;
		}

		if(!param) return url;

		var urlSet = clean($.extend(true, parse(url), param)), temp;

		url = param.authority;

		if(!url) {
			url = param.host || (urlSet.subdomain && urlSet.subdomain + '.') + urlSet.domain;

			if(url) {
				url += urlSet.port && ':' + urlSet.port;
				url = (param.userinfo || urlSet.user && urlSet.user + (urlSet.password && ':' + urlSet.password) + '@') + url;
				url = (urlSet.scheme ? urlSet.scheme + '://' : '//') + url;
			}
		}

		if(param.relative) {
			url += param.relative;
		}
		else {
			url += param.path || urlSet.directory + urlSet.file;
			url += (temp = param.query || $.param(urlSet.querySet)) && '?' + temp;
			url += (temp = param.fragment || $.param(urlSet.fragmentSet)) && '#' + temp;
		}

		return url;
	};

	$.urlSet = function(url, param)
	{
		return parse($.url(url, param));
	};

	var attrMap = {
		'#document': 'URL',
		a: 'href',
		base: 'href',
		form: 'action',
		iframe: 'src',
		img: 'src',
		input: 'src',
		link: 'href',
		script: 'src'
	};

	$.fn.urlSet = function()
	{
		return this[0] && $.urlSet(this.attr(attrMap[this[0].nodeName.toLowerCase()]));
	};

	$.hash = function(name, val)
	{
		if(val === undefined) {
			return name ? $.urlSet().fragmentSet[name] : $.urlSet().fragmentSet;
		}

		var hash, param = { poweredby: null };
		if(name) param[name] = val;
		hash = $.hash(param);

		if(location.hash || hash !== '#') location.hash = hash === '#' ? '#.' : hash;
	};
})(jQuery);
