$.extend(an.plugins, {

'12c98ebc-873c-4636-a11a-2c4c6ce7d4c2':
{
	desc: '設定內核樣式',
	priority: 1,
	page: { 65535: 'comp' },
	type: 2,
	options: {
		sUIFontColor: { desc: 'UI主顏色', defaultValue: '#808080', type: 'text', access: 'public' },
		sUIHoverColor: { desc: 'UI連結懸浮顏色', defaultValue: '#9ACD32', type: 'text', access: 'public' },
		sMainFontColor: { desc: '論壇主要字體顏色', defaultValue: '#000000', type: 'text', access: 'public' },
		sMainBorderColor: { desc: '論壇主要邊框顏色', defaultValue: '#000000', type: 'text', access: 'public' },
		sSecBorderColor: { desc: '論壇次要邊框顏色', defaultValue: '#CCCCCC', type: 'text', access: 'public' },
		sMainBgColor: { desc: '論壇主要背景顏色', defaultValue: '#FFFFFF', type: 'text', access: 'public' },
		sSecBgColor: { desc: '論壇次要背景顏色', defaultValue: '#F8F8F8', type: 'text', access: 'public' },
		sMainHeaderFontColor: { desc: '論壇標題字體顏色', defaultValue: '#FFFFFF', type: 'text', access: 'public' },
		sMainHeaderBgColor: { desc: '論壇標題背景顏色', defaultValue: '#336699', type: 'text', access: 'public' }
	},
	queue: [{
		priority: 1,
		fn: function()
		{
			$.ss('\
			#an, #an legend { color: {0.sMainFontColor}; } \
			\
			.an-forum, .an-forum textarea { background-color: {0.sSecBgColor}; } \
			.an-forum input[type="text"], .an-forum select { background-color: {0.sMainBgColor}; border: 1px solid {0.sMainBorderColor}; } \
			.an-forum input[type="text"]:disabled, .an-forum select:disabled { color: graytext; } \
			.an-forum, .an-forum h4, .an-forum div, .an-forum td, .an-forum dl, .an-forum dt, .an-forum dd, .an-forum ul, .an-forum li, .an-forum a, .an-forum fieldset, .an-forum hr { border: 0 solid {0.sMainBorderColor}; } \
			.an-forum * { color: {0.sMainFontColor}; } \
			.an-forum a { text-decoration: none; } \
			.an-forum a:hover { text-decoration: underline; } \
			.an-forum table { width: 100%; border-collapse: collapse; } \
			.an-forum td { line-height: 1.5em; padding: 0 0.2em; border-width: 1px; } \
			.an-forum-header[class], .an-forum thead td { color: {0.sMainHeaderFontColor}; background-color: {0.sMainHeaderBgColor}; } \
			.an-forum-header[class] { border-bottom-width: 1px; } \
			\
			.an-content-note, .an-content-line, .an-content-box { color: {0.sUIFontColor}; } \
			.an-content-note { margin-right: 2px; cursor: default; } \
			.an-content-line { font-size: 0.625em; font-style: italic; } \
			.an-content-box { display: inline-block; border: 1px solid; padding: 1px 2px; } \
			a.an-content-line, a.an-content-box { text-decoration: none !important; } \
			a.an-content-line:hover, a.an-content-box:hover { color: {0.sUIHoverColor}; } \
			',
			this.options()
			);
		}
	}]
},

'6464e397-dfea-477f-9706-025ec439e810':
{
	desc: '設定UI樣式',
	page: { 65535: 'comp' },
	type: 2,
	options:
	{
		sMenuFontSize: { desc: 'UI主要字體大小(px)', defaultValue: '16', type: 'text' },
		sSmallFontSize: { desc: 'UI細字體大小(px)', defaultValue: '10', type: 'text' }
	},
	queue: [{
		priority: 1,
		fn: function()
		{
			$.ss('\
			.an-box { display: none; position: fixed; left: 50%; top: 50%; z-index: 10; border-width: 1px; } \
			.an-box-header { line-height: 1.8em; margin: 0; padding: 0 0 0 0.2em; } \
			.an-box-content { overflow: auto; position: relative; } \
			\
			.an-menu { font-size: {0.sMenuFontSize}px; } \
			.an-menu a { display: block; } \
			.an-menu a:hover { color: {0.sUIHoverColor}; } \
			\
			.an-small { font-size: {0.sSmallFontSize}px; } \
			\
			#an-ui ul { margin: 0; padding: 0; list-style: none; } \
			#an-ui a:focus { outline: 0; } \
			\
			.an-mod { position: fixed; color: {0.sUIFontColor}; } \
			.an-mod, .an-mod * { border: 0 solid {0.sUIFontColor}; } \
			.an-mod a { text-decoration: none; color: {0.sUIFontColor}; } \
			\
			#an-backlayer { display: none; opacity: 0; -ms-filter: "alpha(opacity=0)"; z-index: 5; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: gray; } \
			\
			#an-mainmenu { top: 15%; right: 0; } \
			#an-mainmenu a { padding: 0.3em 0.35em 0 0; border-bottom-width: 1px; } \
			',
			this.options()
			);
		}
	}]
},

'89615a78-21b7-46bd-aeb1-12e7f031e896':
{
	desc: '強制更改全局字體',
	page: { 65534: off },
	type: 2,
	options: { sMainFontFamily: { desc: '字體名稱', defaultValue: 'SimSun', type: 'text' } },
	queue: [{
		priority: 1,
		fn: function()
		{
			$.ss('body * { font-family: {0} !important; }', this.options('sMainFontFamily'));
		}
	}]
},

'cad6d058-f999-460d-ac29-4074f33f46fb':
{
	desc: '設定連結樣式',
	page: { 65534: off },
	type: 2,
	options:
	{
		sMainLinkFontColor: { desc: '普通連結顏色', defaultValue: '#1066d2', type: 'text' },
		sMainVisitedColor: { desc: '已訪問連結顏色', defaultValue: '#800080', type: 'text' },
		sMainHoverColor: { desc: '連結懸浮顏色', defaultValue: '', type: 'text' },
		bRemoveLinkUnderline: { desc: '移除連結底線', defaultValue: false, type: 'checkbox' }
	},
	queue: [{
		priority: 1,
		fn: function()
		{
			var sTextCSS = this.options('bRemoveLinkUnderline')
				? 'text-decoration: none; } a[href^="/blog/blog.aspx"] > span { text-decoration: none !important; } .repliers_right a { text-decoration: underline; }'
				: '}';

			$.ss('\
			body > form a, #ctl00_ContentPlaceHolder1_MiddleAdSpace1 a { color: {0.sMainLinkFontColor}; ' + sTextCSS + ' \
			body > form a[href*="view.aspx"]:visited, .repliers_right a:visited { color: {0.sMainVisitedColor}; } \
			body > form a[href]:hover { color: {0.sMainHoverColor}; } \
			',
			this.options()
			);
		}
	}]
},

'7574582b-2fea-4079-8dfb-7ac4e5587ecb':
{
	desc: '改變論壇樣式',
	page: { 65534: off },
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
		sHighlightBgColor: { desc: '高亮背景顏色', defaultValue: '#E9EC6C', type: 'text', access: 'public' },
		sTimeFontColor: { desc: '時間字體顏色', defaultValue: '#800000', type: 'text' },
		sMaleFontColor: { desc: '男用戶連結顏色', defaultValue: '#0066FF', type: 'text' },
		sFemaleFontColor: { desc: '女用戶連結字體顏色', defaultValue: '#FF0066', type: 'text' },
		sQuoteFontColor: { desc: '引用字體顏色', defaultValue: '#0000A0', type: 'text' },
		sFooterBgColor: { desc: '頁腳横條背景顏色', defaultValue: '#FFCC00', type: 'text' }
	},
	queue: [{
		priority: 1,
		fn: function()
		{
			$.ss('\
			/* Global stuff */\
			body { background-color: {0.sMainBgColor}; } \
			body, p, td, .addthis_toolbox > a, .addthis_toolbox > span { color: {0.sMainFontColor}; } \
			/* main border */\
			div[style*="0, 0, 0"], div[style*="000000"], .DivMarkThread, .repliers_header, .repliers_left, .repliers, .repliers td, .Topic_ForumInfoPanel table, .Topic_ForumInfoPanel th { border-color: {0.sMainBorderColor} !important; } \
			#aspnetForm table[cellspacing="1"][cellpadding="2"], #ctl00_ContentPlaceHolder1_PMMsgTable, #ctl00_ContentPlaceHolder1_QuickReplyTable, #ctl00_ContentPlaceHolder1_QuickReplyLoginTable { background-color: {0.sMainBorderColor} !important; } \
			*[style*="128, 128, 128"], *[style*="808080"] { background-color: transparent !important; } \
			/* sec border */\
			.main_table1 { border-color: {0.sSecBorderColor}; } \
			/* nearly-white backgrounds */\
			*[style*="rgb(23"], *[style*="rgb(24"], *[style*="#E"], *[style*="#F"], *[style*="#e"], *[style*="#f"], .Topic_ForumInfoPanel table td { background-color: {0.sSecBgColor} !important; } \
			/* PM Box & white table cells */\
			.DivMarkThread, .ListPMText, *[style*="255, 255, 255"], *[style*="#FFFFFF"], *[style*="background-color: white"], *[style*="BACKGROUND-COLOR: white"], *[bgcolor="#f8f8f8"] { background-color: {0.sMainBgColor} !important; } \
			/* headers */\
			.repliers_header, *[style*="51, 102, 153"], *[style*="#336699"], .Topic_ForumInfoPanel table th, .Topic_ListPanel table th { color: {0.sMainHeaderFontColor} !important; background-color: {0.sMainHeaderBgColor} !important; } \
			/* under logo links, footer text, username links, bookmarkbar */\
			.encode_link, .txt_11pt_1A3448, *[style*="color: black"], *[style*="COLOR: black"], .hkg_bottombar_link { color: {0.sMainFontColor} !important; } \
			/* non-transparent images */\
			.TopMenuPanel, .bg_top { background-image: url({0.sTopBgImage}); } \
			.PageMiddleBox, .bg_main { background-image: url({0.sMainBgImage}); } \
			/* main logo */\
			#ctl00_TopBarHomeLink { display: block; background: url({0.sLogoBgImage}) no-repeat; } \
			#ctl00_TopBarHomeLink img { visibility: hidden; } \
			/* thin bars icon */\
			.ProfileBoxTitle:first-child, .DivResizableBoxTitle:first-child, .title:first-child, *[bgcolor="#6ea0c4"]:first-child, .redhottitle:first-child { background: url({0.sBlueBarBgImage}) no-repeat; } \
			*[src*="/p.jpg"], *[src*="/redhotp.jpg"] { visibility: hidden; } \
			/* blue bars , red bars, and main forum page bars */\
			.ProfileBoxTitle, .DivResizableBoxTitle, .title, *[bgcolor="#6ea0c4"], *[colspan="6"] { background-color: {0.sBlueBarBgColor} !important; color: {0.sBlueBarFontColor}; } \
			.redhottitle { background-color: {0.sRedTitleBgColor}; color: {0.sRedTitleFontColor}; } \
			/* hot people */\
			table[style*="255, 85, 96"], tr[style*="255, 85, 96"], table[style*="#ff5560"], tr[style*="#ff5560"] { background-color: {0.sRedHeaderBgColor} !important; } \
			td[style*="255, 85, 96"], td[style*="#ff5560"] { border-color: {0.sRedHeaderBgColor} !important; } \
			*[style*="0, 51, 102"], *[style*="#003366"] { color: {0.sRedHeaderFontColor} !important; } \
			.redhot_text, a.redhot_link { color: {0.sRedContentFontColor}; } \
			/* hot search */\
			.HitSearchText { color: {0.sMainHeaderFontColor}; } \
			a.hitsearch_link { color: {0.sMainFontColor}; } \
			/* annoucements, profilepage tabs */\
			.DivResizableBoxDetails, .ProfileBoxDetails { border-color: {0.sBlueSecBgColor}; } \
			*[bgcolor="#ccddea"], .ajax__tab_tab, #advarea tr:first-child + tr td { background-color: {0.sBlueSecBgColor} !important; } \
			.p__tab_xp .ajax__tab_tab { color: {0.sMainFontColor}; } \
			.p__tab_xp .ajax__tab_active .ajax__tab_tab, .p__tab_xp .ajax__tab_hover .ajax__tab_tab { color: {0.sMainHoverColor}; } \
			/* hightlight bg */\
			*[style*="233, 236, 108"], *[style*="#E9EC6C"] { background-color: {0.sHighlightBgColor} !important; } \
			/* time text */\
			*[style*="128, 0, 0"], *[style*="#800000"], *[style*="maroon"] { color: {0.sTimeFontColor} !important; } \
			/* male name link */\
			*[style*="0, 102, 255"], *[style*="#0066ff"], *[style*="#0066FF"], *[color="blue"] { color: {0.sMaleFontColor} !important; } \
			/* female name link */\
			*[style*="255, 0, 102"], *[style*="#ff0066"], *[style*="#FF0066"], *[color="red"] { color: {0.sFemaleFontColor} !important; } \
			/* quotes */\
			blockquote > div[style*="color"], blockquote > div[style*="COLOR"] { color: {0.sQuoteFontColor} !important; } \
			/* profilepage avater */\
			table[width="150"] { border-color: {0.sSecBorderColor} !important; } \
			/* footer */\
			.FooterPanel > div:first-child { background-color: {0.sFooterBgColor} !important; } \
			a.terms_link { color: {0.sMainFontColor}; } \
			/* bookmark bar */\
			.hkg_bottombar, .hkg_bottombar *, .hkg_bbMenu, .hkg_bbMenu * { background-color: {0.sSecBgColor}; border-color: {0.sMainBorderColor}; color: {0.sMainFontColor}; } \
			.hkg_bb_bookmark_TitleBox, .hkg_bb_bookmark_TitleBox *, .hkg_bb_bookmarkItem_Hover, .hkg_bb_bookmarkItem_Hover a div { background-color: {0.sMainHeaderBgColor}; color: {0.sMainHeaderFontColor}; } \
			.hkg_bb_bookmarkItem a div { background-color: transparent; color: inherit; } \
			.hkg_bbItem_MiniFunc, .hkg_bbItem_MiniFunc_Hover, .hkg_bbItem, .hkg_bbItem_Hover, .hkg_bbItem_Selected { border: 0; } \
			',
			this.options()
			);
		}
	}]
}

});