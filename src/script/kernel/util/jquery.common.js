$.extend({
	all: function()
	{
		var args = $.slice(arguments);
		var callback = args.pop();
		var pass = true;
		$.digEach.apply(null, args.concat(function()
		{
			if(!callback.apply(this, arguments)) {
				pass = false;
				return false;
			}
		}));
		return pass;
	},

	bitmasks: function(flag, masks)
	{
		if($.isArray(masks)) {
			for(var i=0; i<masks.length; ++i) {
				if(flag & masks[i]) return masks[i];
			}
		}
		else {
			for(var mask in masks) {
				if(flag & mask) return mask;
			}
		}
		return null;
	},

	cookie: function(name, val, topLevel)
	{
		if(!name) {
			var
			match,
			cookieSet = {},
			cookies = document.cookie,
			regex = /\b([^=]+)=([^;]*)/g;

			while(match = regex.exec(cookies)) {
				cookieSet[match[1]] = match[2];
			}

			if(name === null) {
				for(var key in cookieSet) {
					$.cookie(key, null);
				}
			}
			else {
				return cookieSet;
			}
		}
		else if(typeof val === 'undefined') {
			var match = document.cookie.match(new RegExp("\\b" + name + "=([^;]*)"));
      return match && match[1];
		}
		else {
			var cookie = $.format('{0}={1}; path=/', name, val || '');
			var expire = (new Date(val === null ? '1999' : '2999')).toUTCString();

			if(val !== null) {
				document.cookie = $.format('{0}; expires={1}; domain={2}', cookie, expire, topLevel ? $.uriSet().domain : location.hostname);
			}
			else {
				cookie = $.format('{0}; expires={1}', cookie, expire);

				document.cookie = $.format('{0}; domain={1}', cookie, location.hostname);
				document.cookie = cookie;
				document.cookie = $.format('{0}; domain={1}', cookie, $.uriSet().domain);
			}
		}
	},

	// deep extend with array replacing
	copy: function(target)
	{
		var name, src, copy;
		$.each($.slice(arguments, 1), function(i, options)
		{
			for(name in options) {
				src = target[name];
				copy = options[name];
				if(typeof copy !== 'undefined') {
					target[name] = copy && typeof copy === 'object' ? $.copy($.isPlainObject(src) ? src : $.isArray(copy) ? [] : {}, copy) : copy;
				}
			}
		});
		return target;
	},

	correct: function(target)
	{
		if($.isNumber(target)) {
			return +target;
		}
		else {
			return target;
		}
	},

	dig: function(obj)
	{
		for(var i=1; i<arguments.length; ++i) {
			if($.isGarbage(obj)) {
				return;
			}
			obj = obj[arguments[i]];
		}
		return obj;
	},

	digEach: function(target)
	{
		var args = $.slice(arguments, 1);
		var callback = args.pop();
		var len = args.length;
		if(len === 0) {
			args[len++] = null;
		}

		(function dig(target, argIndex, ids)
		{
			if(argIndex === len) {
				return callback.apply(target, ids.concat(target));
			}

			var digIds = args[argIndex++];
			if(typeof digIds === 'string') {
				digIds = [digIds];
			}
			var ret;
			$.each(target, function(id, prop)
			{
				if(!digIds || $.inArray(id, digIds) !== -1) {
					return (ret = dig(prop, argIndex, ids.concat(id)));
				}
			});
			return ret;
		})(target, 0, []);

		return target;
	},

	isNumber: function(target)
	{
		return !isNaN(+target);
	},

	isWord: function(target)
	{
		return typeof target === 'string' || typeof target === 'number';
	},

	isGarbage: function(target)
	{
		return target == null || target === NaN;
	},

	size: function(target)
	{
		var size = 0;
		for(var name in target) {
			++size;
		}
		return size;
	},

	make: function(obj)
	{
		for(var i=1; i<arguments.length; ++i) {
			obj = obj[arguments[i]] || (obj[arguments[i]] = {});
		}
		return obj;
	},

	range: function(start, end)
	{
		var ret = [];
		for(var i=start; i<=end; ++i) {
			ret.push(i);
		}
		return ret;
	},

	run: function(name)
	{
		return $[name] && $[name].apply($, $.slice(arguments, 1));
	},

	slice: function(target, start, end)
	{
		return Array.prototype.slice.apply(target, Array.prototype.slice.call(arguments, 1));
	},

	time: function(start)
	{
		return start ? new Date - start : +new Date;
	},

	//--- Deprecated --//

	winWidth: function(nMutiply)
	{
		return Math.round($(window).width() * (nMutiply || 1));
	},

	winHeight: function(nMutiply)
	{
		return Math.round($(window).height() * (nMutiply || 1));
	}
});

$.fn.extend({
	attrFilter: function(name, is, not)
	{
		var jThis = this;

		if($.isPlainObject(name)) {
			$.each(name, function(name, filter)
			{
				jThis = jThis.attrFilter.apply(jThis, [name].concat(filter));
			});

			return jThis;
		}
		else {
			return jThis.filter(function()
			{
				var val = $(this).attr(name), stay = true;
				$.each([is, not], function(i, regex)
				{
					if(stay && regex) {
						stay = (typeof regex === 'string' ? new RegExp(regex) : regex).test(val);
						if(i === 1) stay = !stay;
					}
				});
				return stay;
			});
		}
	},

	debug: function()
	{
		$.debug(this);
		return this;
	},

	toFlash: function(url, attrSet, paramSet)
	{
		attrSet = $.extend({ width: 0, height: 0, id: this[0].id || 'jquery-flash-' + $.time() }, attrSet);
		paramSet = $.extend({ allowscriptaccess: 'always' }, paramSet);

		if($.browser.msie) {
			attrSet.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			paramSet.movie = url;
		}
		else {
			attrSet.data = url;
			attrSet.type = 'application/x-shockwave-flash';
		}

		var attrs = params = '';

		$.each(attrSet, function(name, val)
		{
			attrs += $.format(' {0}="{1}"', name, val);
		});

		$.each(paramSet, function(name, val)
		{
			params += $.format('<param name="{0}" value="{1}" />', name, val);
		});

		var html = $.format('<object{0}>{1}</object>', attrs, params);

		if($.browser.msie) {
			this[0].outerHTML = html;
			return $('#' + attrSet.id);
		}
		else {
			return $(html).replaceAll(this);
		}
	},

	outerhtml: function()
	{
		return this[0] && (this[0].outerHTML ? this[0].outerHTML : $('<div />').append(this.eq(0).clone()).html());
	},

	fadeToggle: function(sSpeed)
	{
		if(!sSpeed) sSpeed = 'normal';
		return this.is(':hidden') ? this.fadeIn(sSpeed) : this.fadeOut(sSpeed);
	},

	up: function(selector, th)
	{
		if(!th) th = 1;
		return this.map(function()
		{
			var node = this, count = 0;
			while(node.parentNode && node.parentNode.nodeType === 1) {
				node = node.parentNode;
				if(selector && $(node).is(selector) && ++count === th) return node;
			}
			return selector ? null : node;
		});
	},

	root: function()
	{
		return this.__root || (this.__root = $(document).own(this) ? $(document) : this.up());
	},

	own: function(target)
	{
		return this[0] === (target[0] || target) || this.is(target) || !!this.has(target).length;
	},

	top: function(){ return this.offset().top; },
	right: function(){ return this.offset().left + this.innerWidth(); },
	bottom: function(){ return this.offset().top + this.innerHeight(); },
	left: function(){ return this.offset().left; }
});
