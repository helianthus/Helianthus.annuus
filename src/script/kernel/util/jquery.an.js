$.extend({
	benchmark: function(name)
	{
		if(!an.benchmark) an.benchmark = [];
		return name ? an.benchmark.push({ desc: name, time: $.time() }) : an.benchmark;
	},

	doc: function(html)
	{
		return $('<div>' + html.replace(/^[\s\S]+?<form/, '<form').replace(/<\/form>\s*<!--[\s\S]+/, '</form>') + '</div>').eq(0);
	},

	getDoc: function(url, success, setup)
	{
		$.ajax((setup = {
			url: url,
			dataType: 'text',
			timeout: 10000,
			success: function(html)
			{
				var jDoc = $.doc(html);
				jDoc.pageCode() & 61438 ? success.call(setup, jDoc) : setup.error();
			},
			error: function()
			{
				$.run('log', '頁面讀取失敗, 5秒後重新讀取...');
				setTimeout(function(){ $.ajax(setup); }, 5000);
			}
		}));
	},

	isLoggedIn: function()
	{
		return !!$.cookie('username');
	},

	openerInfo: function(callback)
	{
		var info = an.openerInfo || (an.openerInfo = { readyState: 'uninitialized', callbacks: [] });

		if(info.readyState === 'complete') return info;

		info.callbacks.push(callback);

		if(info.readyState === 'uninitialized') {
			info.readyState = 'loading';

			function getInfo(jScope)
			{
				info.readyState = 'complete';
				var jInfo = jScope.replies().jInfos.eq(0);
				$.extend(info, { userid: jInfo.attr('userid'), username: jInfo.attr('username') });

				$.each(info.callbacks, function(){ this(info); });
				delete info.callbacks;
			}

			if($d.pageNo() === 1) {
				getInfo($d);
			}
			else {
				$.getDoc('?message=' + window.messageid, getInfo);
			}
		}
	}
});

$.fn.extend({
	ajaxPageNo: function()
	{
		return this.pageRoot().find('select[name=page]:first').val() * 1;
	},

	isReplyContent: function()
	{
		return !!this.closest('.repliers_right > tbody > tr:first-child > td').length;
	},

	pageNo: function()
	{
		return this.__pageNo || (this.__pageNo = this.uriSet().querySet.page * 1 || 1);
	},

	pageRoot: function()
	{
		var pageRoot = this.eq(0).closest('div');
		return pageRoot.length ? pageRoot : this;
	}
});