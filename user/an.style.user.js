/*
    Copyright (C) 2008  向日

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name Helianthus.Annuus 3: Style Editor
// @namespace http://code.google.com/p/helianthus-annuus/
// @description by 向日
// @include http://forum*.hkgolden.com/*
// @run-at document-start
// ==/UserScript==

(function()
{

var window = (typeof unsafeWindow != 'undefined') ? unsafeWindow : (typeof contentWindow != 'undefined') ? contentWindow : this;
var AN = window.AN || (window.AN = { temp: [], mod: {} });

AN.temp.push(function()
{
	var JSON = window.JSON;
	var $, jQuery = $ = window.jQuery;

	AN.mod['Style Editor'] =
	{
		ver: '1.0.0',
		fn: {

'89615a78-21b7-46bd-aeb1-12e7f031e896':
{
	desc: '強制更改全局字體',
	page: { 65534: false },
	type: 2,
	options: { sMainFontFamily: { desc: '字體名稱', defaultValue: 'SimSun', type: 'text' } },
	once: function()
	{
		AN.util.addStyle($.sprintf('body * { font-family: %s; }', AN.util.getOptions('sMainFontFamily')));
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
		var sTextCSS = AN.util.getOptions('bRemoveLinkUnderline') ? 'text-decoration: none; } .repliers_right a { text-decoration: underline; }' : '}';
		var sStyle = 'body > table a { color: %(sMainLinkFontColor)s; ' + sTextCSS;

		AN.util.addStyle($.sprintf(sStyle + ' \
		body > table a[href*="view.aspx"]:visited { color: %(sMainVisitedColor)s; } \
		body > table a[href]:hover { color: %(sMainHoverColor)s; } \
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
		sLeftTable1BorderColor: { desc: '左欄選單一邊框顏色', defaultValue: '#CCCCCC', type: 'text' },
		sLeftTable1BgImage: { desc: '左欄選單一背景圖片', defaultValue: '/images/left_menu/bg_leftm1.jpg', type: 'text' },
		sLeftTable1FontColor: { desc: '左欄選單一連結顏色', defaultValue: '#333333', type: 'text' },
		sLeftTable1HoverColor: { desc: '左欄選單一懸浮顏色', defaultValue: '#33AAAA', type: 'text' },
		sLeftTable2BorderColor: { desc: '左欄選單二邊框顏色', defaultValue: 'transparent', type: 'text' },
		sLeftTable2BgColor: { desc: '左欄選單二背景顏色', defaultValue: '#CCDDEA', type: 'text' },
		sLeftTable2BgImage: { desc: '左欄選單二背景圖片', defaultValue: '/images/left_menu/bg_leftm2.jpg', type: 'text' },
		sLeftTable2FontColor: { desc: '左欄選單二連結顏色', defaultValue: '#333333', type: 'text' },
		sLeftTable2HoverColor: { desc: '左欄選單二懸浮顏色', defaultValue: '#33AAAA', type: 'text' },
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
		AN.util.addStyle($.sprintf(' \
		/* Global stuff */\
		body { background-color: %(sMainBgColor)s; } \
		p, td { color: %(sMainFontColor)s; } \
		/* main border */\
		.repliers_header, .repliers_left, .repliers, .repliers td { border-color: %(sMainBorderColor)s !important; } \
		body > table table[cellspacing="1"][cellpadding="2"], #ctl00_ContentPlaceHolder1_PMMsgTable, #ctl00_ContentPlaceHolder1_QuickReplyTable { background-color: %(sMainBorderColor)s !important; } \
		*[style*="128, 128, 128"], *[style*="808080"] { background-color: transparent !important; } \
		/* sec border */\
		.main_table1 { border-color: %(sSecBorderColor)s; } \
		/* PM Box & white table cells */\
		.ListPMText, *[style*="255, 255, 255"], *[style*="#FFFFFF"], *[style*="background-color: white"], *[style*="BACKGROUND-COLOR: white"] { background-color: %(sMainBgColor)s !important; } \
		/* nearly-white backgrounds */\
		*[style*="rgb(23"], *[style*="rgb(24"], *[style*="#E"], *[style*="#F"], *[style*="#e"], *[style*="#f"] { background-color: %(sSecBgColor)s !important; } \
		/* headers */\
		.repliers_header, *[style*="51, 102, 153"], *[style*="#336699"] { color: %(sMainHeaderFontColor)s !important; background-color: %(sMainHeaderBgColor)s !important; } \
		/* under logo links, footer text, username links */\
		.encode_link, .txt_11pt_1A3448, *[style*="color: black"], *[style*="COLOR: black"] { color: %(sMainFontColor)s !important; } \
		/* non-transparent images */\
		.bg_top { background-image: url(%(sTopBgImage)s); } \
		.bg_main { background-image: url(%(sMainBgImage)s); } \
		/* main logo */\
		#ctl00_TopBarHomeLink { display: block; background: url(%(sLogoBgImage)s) no-repeat; } \
		#ctl00_TopBarHomeLink img { visibility: hidden; } \
		/* left table 1 */\
		.left_table[class] { border: 1px solid %(sLeftTable1BorderColor)s; background: %(sSecBgColor)s url(%(sLeftTable1BgImage)s) no-repeat bottom right; } \
		a.leftmenu_link { color: %(sLeftTable1FontColor)s; } \
		a.leftmenu_link:hover { color: %(sLeftTable1HoverColor)s; } \
		/* left table 2 */\
		.left_table2[class] { border: 1px solid %(sLeftTable2BorderColor)s; background: %(sLeftTable2BgColor)s url(%(sLeftTable2BgImage)s) no-repeat bottom right; } \
		a.leftmenu_link2 { color: %(sLeftTable2FontColor)s; } \
		a.leftmenu_link2:hover { color: %(sLeftTable2HoverColor)s; } \
		/* thin bars icon */\
		.title:first-child, *[bgcolor="#6ea0c4"]:first-child, .redhottitle:first-child { background-image: url(%(sBlueBarBgImage)s); } \
		*[src*="/p.jpg"], *[src*="/redhotp.jpg"] { visibility: hidden; } \
		/* blue bars , red bars, and main forum page bars */\
		.title, *[bgcolor="#6ea0c4"], *[colspan="6"] { background-color: %(sBlueBarBgColor)s !important; color: %(sBlueBarFontColor)s; } \
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
		*[bgcolor="#ccddea"], .ajax__tab_tab, #advarea tr:first-child + tr td { background-color: %(sBlueSecBgColor)s !important; } \
		.p__tab_xp .ajax__tab_tab { color: %(sMainFontColor)s; } \
		.p__tab_xp .ajax__tab_active .ajax__tab_tab, .p__tab_xp .ajax__tab_hover .ajax__tab_tab { color: %(sMainHoverColor)s; } \
		/* hightlight bg */\
		*[style*="233, 236, 108"], *[style*="#E9EC6C"] { background-color: %(sHighlightBgColor)s !important; } \
		/* time text */\
		*[style*="128, 0, 0"], *[style*="#800000"], *[style*="maroon"] { color: %(sTimeFontColor)s !important; } \
		/* male name link */\
		*[style*="0, 102, 255"], *[color="blue"] { color: %(sMaleFontColor)s !important; } \
		/* female name link */\
		*[style*="255, 0, 102"], *[color="red"] { color: %(sFemaleFontColor)s !important; } \
		/* quotes */\
		blockquote > div[style*="color"], blockquote > div[style*="COLOR"] { color: %(sQuoteFontColor)s !important; } \
		/* profilepage avater */\
		table[width="150"] { border-color: %(sSecBorderColor)s !important; } \
		/* footer */\
		*[bgcolor="#ffcc00"] { background-color: %(sFooterBgColor)s; } \
		',
		AN.util.getOptions()
		));
	}
},

'eb703eac-bb31-4dbe-b28c-0b6d2942b6f5':
{
	desc: '滙入自定CSS(進階用戶專用)',
	page: { 65534: false },
	type: 2,
	options:
	{
		sCustomCSSHref: { desc: '自定CSS檔案位置 [部份瀏覽器不支持本地檔案]', defaultValue: '', type: 'text' },
		sCustomCSSContent: { desc: '自定CSS內容', defaultValue: '/*sample*/ * { color: black !important; }', type: 'text' }
	},
	once: function()
	{
		var sHref = AN.util.getOptions('sCustomCSS');
		if(sHref) $('head').append($.sprintf('<link type="text/css" rel="stylesheet" href="%s" />', sHref));

		var sContent = AN.util.getOptions('sCustomCSSContent');
		if(sContent) AN.util.addStyle(sContent);
	}
}

}}; // end mod

}); // end push

})(); // end anonymous