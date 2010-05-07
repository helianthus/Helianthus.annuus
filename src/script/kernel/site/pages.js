var
all = -1,
normal = -2,
error = 1,
index = 2,
topics = 4,
search = 8,
tags = 16,
view = 32,
profilepage = 64,
sendpm = 128,
post = 256,
login = 512,
giftpage = 1024,
blog = 2048,
message = 4096,
newblog = 8192;

bolanderi.get('PAGES', {
	'-1': { name: null, title: '所有頁' },
	'-2': { name: null, title: '所有正常頁' },
	1: { name: 'error', title: '所有錯誤頁' },
	2: { name: 'default', title: '主論壇頁' },
	4: { name: 'topics', title: '帖子列表頁' },
	8: { name: 'search',  title: '搜尋頁' },
	16: { name: 'tags', title: '標籤搜尋頁' },
	32: { name: 'view', title: '帖子頁' },
	64: { name: 'profilepage', title: '用戶資料頁' },
	128: { name: 'sendpm', title: '私人訊息發送頁' },
	256: { name: 'post', title: '發表/回覆頁' },
	512: { name: 'login', title: '登入頁' },
	1024: { name: 'giftpage', title: '人氣頁' },
	2048: { name: 'blog', title: '網誌頁' },
	4096: { name: 'message', title: '系統信息頁' },
	8192: { name: 'newblog', title: '新增文章頁' }
});

$.fn.extend({
	pageName: function()
	{
		if(this.__pageName) return this.__pageName;

		var root = this.root();

		if(root.find('#ctl00_ContentPlaceHolder1_SystemMessageBoard').length) {
			this.__pageName = 'message';
		}
		else {
			var name = /\w+/.exec($.uriSet(root.find('#aspnetForm').attr('action') || location.href).file);
			this.__pageName = name ? name[0].toLowerCase() : 'default';
		}

		return this.__pageName;
	},

	pageCode: function()
	{
		if(this.__pageCode != null) return this.__pageCode;

		var pageName = this.pageName();

		for(var code in bolanderi.get('PAGES')) {
			if(bolanderi.get('PAGES')[code].name === pageName) {
				return this.__pageCode = code * 1;
			}
		}

		return this.__pageCode = 0;
	}
});
