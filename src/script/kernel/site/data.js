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

an.get('PAGES', {
	'-1': { action: null, title: '所有頁' },
	'-2': { action: null, title: '所有正常頁' },
	1: { action: 'error', title: '所有錯誤頁' },
	2: { action: 'default', title: '主論壇頁' },
	4: { action: 'topics', title: '帖子列表頁' },
	8: { action: 'search',  title: '搜尋頁' },
	16: { action: 'tags', title: '標籤搜尋頁' },
	32: { action: 'view', title: '帖子頁' },
	64: { action: 'profilepage', title: '用戶資料頁' },
	128: { action: 'sendpm', title: '私人訊息發送頁' },
	256: { action: 'post', title: '發表/回覆頁' },
	512: { action: 'login', title: '登入頁' },
	1024: { action: 'giftpage', title: '人氣頁' },
	2048: { action: 'blog', title: '網誌頁' },
	4096: { action: 'message', title: '系統信息頁' },
	4096: { action: 'newblog', title: '新增文章頁' }
});

an.get('RUN_AT', { document_start: 1, document_end: 4, window_loaded: 7 });
an.get('PRIORITY', { high: 0, normal: 1, low: 2 });