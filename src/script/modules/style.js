AN.mod['Style Editor'] = { ver: 'N/A', author: '向日', fn: {

'89615a78-21b7-46bd-aeb1-12e7f031e896':
{
	desc: '強制更改全局字體',
	page: { 65534: false },
	type: 2,
	options: { sMainFontFamily: { desc: '字體名稱', defaultValue: 'SimSun', type: 'text' } },
	once: function()
	{
		AN.util.stackStyle($.sprintf('#aspnetForm > div *, #an { font-family: %s; }', AN.util.getOptions('sMainFontFamily')));
	}
},

'eda2bf08-c9d8-45ed-9f97-1936be93e32d':
{
	desc: '強制更改全局字體大小',
	page: { 65534: false },
	type: 2,
	options: { sMainFontSize: { desc: '字體大小', defaultValue: '16', type: 'text' } },
	once: function()
	{
		AN.util.stackStyle($.sprintf('body, td, p { font-size: %spx; }', AN.util.getOptions('sMainFontSize')));
	}
},

'cad6d058-f999-460d-ac29-4074f33f46fb':
{
	desc: '設定連結樣式',
	page: { 65534: false },
	type: 2,
	options:
	{
		sMainLinkFontColor: { desc: '普通連結顏色', defaultValue: '#1066d2', type: 'text' },
		sMainVisitedColor: { desc: '已訪問連結顏色', defaultValue: '#800080', type: 'text' },
		sMainHoverColor: { desc: '連結懸浮顏色', defaultValue: '', type: 'text' },
		bRemoveLinkUnderline: { desc: '移除連結底線', defaultValue: false, type: 'checkbox' }
	},
	once: function()
	{
		var sTextCSS = AN.util.getOptions('bRemoveLinkUnderline')
			? 'text-decoration: none; } a[href^="/blog/blog.aspx"] > span { text-decoration: none !important; } .repliers_right a { text-decoration: underline; }'
			: '}';

		AN.util.stackStyle($.sprintf('\
		body > form a, #ctl00_ContentPlaceHolder1_MiddleAdSpace1 a { color: %(sMainLinkFontColor)s; ' + sTextCSS + ' \
		body > form a[href*="view.aspx"]:visited, .repliers_right a:visited { color: %(sMainVisitedColor)s; } \
		body > form a[href]:hover { color: %(sMainHoverColor)s; } \
		',
		AN.util.getOptions()
		));
	}
},

'7574582b-2fea-4079-8dfb-7ac4e5587ecb':
{
	desc: '改變論壇樣式',
	page: { 65534: false },
	type: 2,
	options:
	{
		sLogoBgImage: { desc: '高登Logo圖片', defaultValue: '/images/index_images/logo.jpg', type: 'text' },
		sTopBgImage: { desc: '頂部背景圖片', defaultValue: '/images/index_images/bg_top.jpg', type: 'text' },
		sMainBgImage: { desc: '主表格背景圖片', defaultValue: '/images/index_images/bg_maintop.jpg', type: 'text' },
		sRedTitleFontColor: { desc: '紅人榜標題字體顏色', defaultValue: '#FFFFFF', type: 'text' },
		sRedTitleBgColor: { desc: '紅人榜標題背景顏色', defaultValue: '#CC2331', type: 'text' },
		sRedHeaderFontColor: { desc: '紅人榜第一列字體顏色', defaultValue: '#003366', type: 'text' },
		sRedHeaderBgColor: { desc: '紅人榜第一列背景顏色', defaultValue: '#FF5560', type: 'text' },
		sRedContentFontColor: { desc: '紅人榜內容字體顏色', defaultValue: '#000000', type: 'text' },
		sBlueBarFontColor: { desc: '藍色橫條字體顏色', defaultValue: '#FFFFFF', type: 'text' },
		sBlueBarBgColor: { desc: '藍色橫條背景顏色', defaultValue: '#6EA0C4', type: 'text' },
		sBlueBarBgImage: { desc: '藍色橫條背景圖片', defaultValue: '/images/left_menu/p.png', type: 'text' },
		sBlueSecBgColor: { desc: '高登公告內部橫條背景顏色', defaultValue: '#CCDDEA', type: 'text' },
		sHighlightBgColor: { desc: '高亮背景顏色', defaultValue: '#E9EC6C', type: 'text' },
		sTimeFontColor: { desc: '時間字體顏色', defaultValue: '#800000', type: 'text' },
		sMaleFontColor: { desc: '男用戶連結顏色', defaultValue: '#0066FF', type: 'text' },
		sFemaleFontColor: { desc: '女用戶連結字體顏色', defaultValue: '#FF0066', type: 'text' },
		sQuoteFontColor: { desc: '引用字體顏色', defaultValue: '#0000A0', type: 'text' },
		sFooterBgColor: { desc: '頁腳横條背景顏色', defaultValue: '#FFCC00', type: 'text' }
	},
	once: function()
	{
		AN.util.stackStyle($.sprintf(' \
		/* Global stuff */\
		body, textarea, input, select { background-color: %(sMainBgColor)s; border: 2px solid %(sMainBorderColor)s; } \
		body, p, td, textarea, input, select, .addthis_toolbox > a, .addthis_toolbox > span, .href_txt1 { color: %(sMainFontColor)s; } \
		*[style*="#EADEB8"] { background-color: %(sSecBgColor)s; } \
		/* main border */\
		div[style*="0, 0, 0"], div[style*="000000"], .DivMarkThread, .repliers_header, .repliers_left, .repliers, .repliers td, .Topic_ForumInfoPanel table, .Topic_ForumInfoPanel th { border-color: %(sMainBorderColor)s !important; } \
		#aspnetForm table[cellspacing="1"][cellpadding="2"], #ctl00_ContentPlaceHolder1_PMMsgTable, #ctl00_ContentPlaceHolder1_QuickReplyTable, #ctl00_ContentPlaceHolder1_QuickReplyLoginTable { background-color: %(sMainBorderColor)s !important; } \
		*[style*="128, 128, 128"], *[style*="808080"] { background-color: transparent !important; } \
		/* sec border */\
		.main_table1 { border-color: %(sSecBorderColor)s; } \
		/* nearly-white backgrounds */\
		*[style*="rgb(23"], *[style*="rgb(24"], *[style*="#E"], *[style*="#F"], *[style*="#e"], *[style*="#f"], .Topic_ForumInfoPanel table td { background-color: %(sSecBgColor)s !important; } \
		/* PM Box & white table cells */\
		.DivMarkThread, .ListPMText, *[style*="255, 255, 255"], *[style*="#FFFFFF"], *[style*="background-color: white"], *[style*="BACKGROUND-COLOR: white"], *[bgcolor="#f8f8f8"] { background-color: %(sMainBgColor)s !important; } \
		/* headers */\
		*[style*="#6ea0c3"], .repliers_header, *[style*="51, 102, 153"], *[style*="#336699"], .Topic_ForumInfoPanel table th, .Topic_ListPanel table th { color: %(sMainHeaderFontColor)s !important; background-color: %(sMainHeaderBgColor)s !important; } \
		/* under logo links, footer text, username links, bookmarkbar */\
		.encode_link, .txt_11pt_1A3448, *[style*="color: black"], *[style*="COLOR: black"], .hkg_bottombar_link { color: %(sMainFontColor)s !important; } \
		/* non-transparent images */\
		.TopMenuPanel, .bg_top { background-image: url(%(sTopBgImage)s); } \
		.PageMiddleBox, .bg_main { background-image: url(%(sMainBgImage)s); } \
		/* main logo */\
		#ctl00_TopBarHomeLink { display: block; background: url(%(sLogoBgImage)s) no-repeat; } \
		#ctl00_TopBarHomeLink img { visibility: hidden; } \
		/* thin bars icon */\
		.ProfileBoxTitle:first-child, .DivResizableBoxTitle:first-child, .title:first-child, *[bgcolor="#6ea0c4"]:first-child, .redhottitle:first-child { background: url(%(sBlueBarBgImage)s) no-repeat; } \
		*[src*="/p.jpg"], *[src*="/redhotp.jpg"] { visibility: hidden; } \
		/* blue bars , red bars, and main forum page bars */\
		.ProfileBoxTitle, .DivResizableBoxTitle, .title, *[bgcolor="#6ea0c4"], *[colspan="6"] { background-color: %(sBlueBarBgColor)s !important; color: %(sBlueBarFontColor)s; } \
		.redhottitle { background-color: %(sRedTitleBgColor)s; color: %(sRedTitleFontColor)s; } \
		/* hot people */\
		table[style*="255, 85, 96"], tr[style*="255, 85, 96"], table[style*="#ff5560"], tr[style*="#ff5560"] { background-color: %(sRedHeaderBgColor)s !important; } \
		td[style*="255, 85, 96"], td[style*="#ff5560"] { border-color: %(sRedHeaderBgColor)s !important; } \
		*[style*="0, 51, 102"], *[style*="#003366"] { color: %(sRedHeaderFontColor)s !important; } \
		.redhot_text, a.redhot_link { color: %(sRedContentFontColor)s; } \
		/* hot search */\
		.HitSearchText { color: %(sMainHeaderFontColor)s; } \
		a.hitsearch_link { color: %(sMainFontColor)s; } \
		/* annoucements, profilepage tabs */\
		.DivResizableBoxDetails, .ProfileBoxDetails { border-color: %(sBlueSecBgColor)s; } \
		*[bgcolor="#ccddea"], .ajax__tab_tab, #advarea tr:first-child + tr td { background-color: %(sBlueSecBgColor)s !important; } \
		.p__tab_xp .ajax__tab_tab { color: %(sMainFontColor)s; } \
		.p__tab_xp .ajax__tab_active .ajax__tab_tab, .p__tab_xp .ajax__tab_hover .ajax__tab_tab { color: %(sMainHoverColor)s; } \
		/* hightlight bg */\
		*[style*="233, 236, 108"], *[style*="#E9EC6C"] { background-color: %(sHighlightBgColor)s !important; } \
		/* time text */\
		*[style*="128, 0, 0"], *[style*="#800000"], *[style*="maroon"] { color: %(sTimeFontColor)s !important; } \
		/* male name link */\
		*[style*="0, 102, 255"], *[style*="#0066ff"], *[style*="#0066FF"], *[color="blue"] { color: %(sMaleFontColor)s !important; } \
		/* female name link */\
		*[style*="255, 0, 102"], *[style*="#ff0066"], *[style*="#FF0066"], *[color="red"] { color: %(sFemaleFontColor)s !important; } \
		/* quotes */\
		blockquote > div[style*="color"], blockquote > div[style*="COLOR"] { color: %(sQuoteFontColor)s !important; } \
		/* profilepage avater */\
		table[width="150"] { border-color: %(sSecBorderColor)s !important; } \
		/* footer */\
		.FooterPanel > div:first-child { background-color: %(sFooterBgColor)s !important; } \
		a.terms_link { color: %(sMainFontColor)s; } \
		/* bookmark bar */\
		.hkg_bottombar, .hkg_bottombar *, .hkg_bbMenu, .hkg_bbMenu * { background-color: %(sSecBgColor)s; border-color: %(sMainBorderColor)s; color: %(sMainFontColor)s; } \
		.hkg_bb_bookmark_TitleBox, .hkg_bb_bookmark_TitleBox *, .hkg_bb_bookmarkItem_Hover, .hkg_bb_bookmarkItem_Hover a div { background-color: %(sMainHeaderBgColor)s; color: %(sMainHeaderFontColor)s; } \
		.hkg_bb_bookmarkItem a div { background-color: transparent; color: inherit; } \
		.hkg_bbItem_MiniFunc, .hkg_bbItem_MiniFunc_Hover, .hkg_bbItem, .hkg_bbItem_Hover, .hkg_bbItem_Selected { border: 0; } \
		',
		AN.util.getOptions()
		));
	}
}

}};