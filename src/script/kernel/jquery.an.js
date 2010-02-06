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

			if($.pageNo() === 1) {
				getInfo($d);
			}
			else {
				$.getDoc('?message=' + window.messageid, getInfo);
			}
		}
	},

	pageCode: function(pageName)
	{
		if(!pageName) pageName = $.pageName();

		for(var code in an.pages) {
			if(an.pages[code].action === pageName) {
				return pageCode = code * 1;
			}
		}
		return 0;
	},

	pageName: function(url)
	{
		var uriSet = $.uriSet(url);
		return (uriSet.filename && uriSet.filename.replace(/\.[^.]+$/, '') || uriSet.directory && uriSet.directory.slice(1, -1)).toLowerCase();
	},

	pageNo: function(url)
	{
		return $.uriSet(url).querySet.page * 1 || 1;
	}
});

$.fn.extend({
	ajaxPageNo: function()
	{
		return this.pageRoot().find('select[name=page]:first').val() * 1;
	},

	pageCode: function()
	{
		return this.__pageCode !== undefined ? this.__pageCode : (this.__pageCode = $.pageCode(this.pageName()));
	},

	pageName: function()
	{
		if(this.__pageName) return this.__pageName;

		var root = this.root();

		return this.__pageName || (this.__pageName =
			root.find('#ctl00_ContentPlaceHolder1_SystemMessageBoard').length && 'message'
			|| (this.__pageName = root.find('#aspnetForm').attr('action')) && $.pageName(this.__pageName)
			|| root.find('body > b:first-child') && 'terms'
			|| 'error'
		);
	},

	pageNo: function()
	{
		return this[0] && this.uriSet().querySet.page * 1 || 1;
	},

	pageRoot: function()
	{
		var pageRoot = this.closest('div');
		return pageRoot.length ? pageRoot : this;
	},

	replies: function()
	{
		return this !== $d && this.__replies || $.extend((this.__replies = this.find('.repliers')), {
			jInfos: this.__replies.children().children('tr[userid]'),
			jNameLinks: this.__replies.find('.repliers_left > div > a'),
			jContents: this.__replies.find('.repliers_right > tbody > tr:first-child > td')
		});
	},

	topics: function()
	{
		return this !== $d && this !== this.topicTable() && this.__topics || (this.__topics = this.topicTable().find('tr').has('td > a'));
	},

	topicTable: function()
	{
		var jScope = $d.own(this) ? $d : this;
		return jScope.__topicTable || (jScope.__topicTable = this.find({
			'topics': '#HotTopics > div > table',
			'search': '#ctl00_ContentPlaceHolder1_topics_form > table + table > tbody > tr > td > table',
			'tags': '#ctl00_ContentPlaceHolder1_topics_form > table + table > tbody > tr > td > table',
			'profilepage': '#ctl00_ContentPlaceHolder1_UpdatePanelHistory .main_table1 > table > tbody > tr > td > table'
		}[jScope.pageName()]));
	}
});