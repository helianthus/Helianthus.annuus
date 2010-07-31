// part of it is based on parseUri by Steven Levithan
// http://blog.stevenlevithan.com/archives/parseuri

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
	].join(''), 'i');

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
		var uriSet = {}, i = keys.length, arr = regex.exec(unescape(url));

		while(i--) {
			uriSet[keys[i]] = arr[i] || '';
		}

		return $.extend(uriSet, { querySet: $.deparam(uriSet.query), fragmentSet: $.deparam(uriSet.fragment) });
	}

	$.uri = function(url, param)
	{
		if(typeof url !== 'string') {
			param = url;
			url = location.href;
		}

		if(!param) return url;

		var urlSet = clean($.copy(parse(url), param)), temp;

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

	$.uriSet = function(url, param)
	{
		return parse($.uri(url, param));
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

	$.fn.uriSet = function()
	{
		return this[0] && $.uriSet(this.attr(attrMap[this[0].nodeName.toLowerCase()]));
	};

	$.hash = function(name, val)
	{
		if(val === undefined) {
			return name ? $.uriSet().fragmentSet[name] : $.uriSet().fragmentSet;
		}

		var hash, param = { poweredby: null };
		if(name) param[name] = val;
		hash = $.hash(param);

		if(location.hash || hash !== '#') location.hash = hash === '#' ? '#poweredby=Project.Helianthus' : hash;
	};
})(jQuery);
