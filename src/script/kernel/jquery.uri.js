// part of it is based on parseUri by Steven Levithan
// http://blog.stevenlevithan.com/archives/parseuri

(function($)
{
	var
	keys = ['source','protocol','authority','userinfo','user','password','host','hostname','subdomain','domain','port','relative','pathname','directory','filename','query','fragment'],
	regex = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]+)(?::([^:@]*))?)?@)?(((?:([^:\/?#]+?)\.)?([^:\/?#.]+\.[^:\/?#]+))?(?::(\d*))?)))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;

	function clean(obj)
	{
		for(var key in obj) {
			if(obj[key] === null) {
				delete obj[key];
			}
			else if(typeof obj[key] === 'object') {
				clean(obj[key]);
			}
		}

		return obj;
	}

	function parse(url)
	{
		var uriSet = {}, i = keys.length, arr = regex.exec(url);

		while(i--) uriSet[keys[i]] = arr[i] || '';

		return clean($.extend(uriSet, { querySet: $.deparam(unescape(uriSet.query)), fragmentSet: $.deparam(uriSet.fragment) }));
	}

	$.uri = function(url, param)
	{
		if(typeof url !== 'string') {
			param = url;
			url = location.href;
		}

		if(!param) return url;

		var ret = '', uriSet = clean($.extend(true, parse(url), param)), paramed;

		if(param.host) {
			ret += param.host;
		}
		else {
			if(param.hostname) {
				ret += param.hostname;
			}
			else if(uriSet.domain) {
				ret += (uriSet.subdomain && uriSet.subdomain + '.') + uriSet.domain;
			}

			if(uriSet.port) ret += ':' + uriSet.port;
		}

		if(ret) {
			if(param.authority) {
				ret += param.authority;
			}
			else if(uriSet.user) {
				ret += uriSet.user + (uriSet.password && ':' + uriSet.password) + '@';
			}

			ret = (uriSet.protocol ? uriSet.protocol + '://' : '//') + ret;
		}

		if(param.relative) {
			ret += param.relative;
		}
		else {
			if(param.pathname) {
				ret += param.pathname;
			}
			else if(uriSet.filename) {
				ret += uriSet.directory + uriSet.filename;
			}

			if(param.query) {
				ret += '?' + param.query;
			}
			else if(paramed = $.param(uriSet.querySet)) {
				ret += '?' + paramed;
			}

			if(param.fragment) {
				ret += '#' + param.fragment;
			}
			else if(paramed = $.param(uriSet.fragmentSet)) {
				ret += '#' + paramed;
			}
		}

		return ret;
	};

	$.uriSet = function(url, param)
	{
		return parse($.uri(url, param));
	};

	$.fn.uriSet = function()
	{
		return this[0] && $.uriSet(this[0].nodeType === 1 ? this.attr($.elemUrlAttr()[this[0].nodeName.toLowerCase()]) : this[0].URL);
	};

	$.search = function(url, param)
	{
		if(typeof url !== 'string') {
			param = url;
			url = location.search;
		}

		return param ? '?' + $.uriSet(url, { querySet: param }).query : url;
	};

	$.hash = function(url, param)
	{
		if(typeof url !== 'string') {
			param = url;
			url = location.hash;
		}

		return param ? '#' + $.uriSet(url, { fragmentSet: param }).fragment : url;
	};
})(jQuery);

/*
^
(?:([^:\/?#]+):)? // protocol

(?:\/\/( // authority
	(?:( // userInfo
		([^:@]*)(?::([^:@]*))?)?@ // user & password
	)?
	( // host
		( hostname
			(?:([^:\/?#]+?)\.)?([^:\/?#.]+\.[^:\/?#]+))? // subdomain & domain
		)
		(?::(\d*))? // port
	)
))?

( // relative
	( // pathname
		((?:[^?#\/]*\/)*) // directory
		([^?#]*) // filename
	)
	(?:\?([^#]*))? // query
	(?:#(.*))? // fragment
)
*/