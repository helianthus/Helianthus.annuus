AN.mod['Layout Designer'] = { ver: 'N/A', author: '向日', fn: {

'4bf6619f-2cd8-4aa2-a54a-e7d72wgs8603':
{
	desc: '修正改變搜尋列時可能造成的顯示錯誤',
	page: { 4: true },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('.Topic_FunctionPanel > .ClearLeft { clear: both; } /*-> IE bug fix? ->*/ .Topic_FunctionPanel { overflow: hidden; }');
	}
},

'5e173905-9c47-4f37-8d3f-4c31ea871115':
{
	desc: '隱藏頂部藍色列',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('body > #aspnetForm > table > tbody > tr:first-child { display: none; }');
	}
},

'7ca54ba4-e2b7-489c-9adc-7ac7d62012f0':
{
	desc: '隱藏頂部啡色列',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('body > #aspnetForm > table > tbody > tr:first-child + tr { display: none; }');
	}
},

'7af1060d-d38c-40b9-b16b-df1bb799cb74':
{
	desc: '隱藏Logo列',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('body > #aspnetForm > table > tbody > tr:first-child + tr + tr { display: none; }');
	}
},

'd0164ba6-a5a2-4850-ab67-658b840fd3ef':
{
	desc: '隱藏繁簡轉換/addThis列',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('\
		.PageMiddleFunctions { height: 5px; } \
		.PageMiddleFunctions > div { display: none; } \
		');
	}
},

/*
'a7dc713c-2d23-4254-be8b-16cf6e9bbe8f':
{
	desc: '優化addThis組件',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('\
		.addthis_toolbox { padding-top: 3px; } \
		.addthis_toolbox > a, .addthis_toolbox > span { font-family: arial !important; color: black; } \
		');
	}
},
*/

'bbd5f176-c024-4684-ba98-b72da376a6eb':
{
	desc: '隱藏最底頁腳',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('.FooterPanel { display: none; }');
	}
},

'5fd907ce-21dc-44b9-b280-3cb145c53c92':
{
	desc: '隱藏頁底空白',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('.FooterPanel ~ br { display: none; }');
	}
},
/*
'8c317615-b5e7-4b1a-a140-b7319c5b0a5b':
{
	desc: '隱藏Bookmark Bar',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#hkg_bottombar { display: none; }');
	}
},

'd1dc862f-a7b3-4b29-a50f-440fc9c5fef0':
{
	desc: '縮短Bookmark Bar',
	page: { 65534: true },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#hkg_bottombar { width: auto; }');
	}
},
*/
'02837e6a-3dd7-4c73-a155-90d6f6edd8f9':
{
	desc: '拉闊頁面',
	page: { 65534: false },
	type: 3,
	options: { nPageWidth: { desc: '頁面闊度 [可設定為80%, 1000px等]', defaultValue: '100%', type: 'text' } },
	once: function()
	{
		var w = AN.util.getOptions('nPageWidth');

		AN.util.addStyle($.sprintf('\
		.PageWidthContainer, /* type=FN */ #PageMiddlePanel > div[style] > table { width: %s; } \
		.PageMiddleBox { width: auto; padding: 9px 0; } \
		#ctl00_ContentPlaceHolder1_ProfileForm td[width="8"] { display: none; } \
		',
		w === 'auto' ? '100%' : w
		));
	}
},

'1cbed44e-f3d5-4d53-b1e7-2d60e356f3f2':
{
	desc: '隱藏個人連結',
	page: { 60: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#MainPageAd2 + br + div, #MainPageAd2 + div { display: none; }');
	}
},

'1c63cc45-21f7-40ab-905a-730dabffc2ab':
{
	desc: '隱藏高登公告',
	page: { 60: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#MainPageAd2 ~ .DivResizableBoxContainer { display: none; }');
	}
},

'cc95985d-34df-409d-a574-e8dca1531a3d':
{
	desc: '隱藏精選文章',
	page: { 4: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#MainPageAd2 ~ iframe[src*="/TopArticle_"] { display: none; }');
	}
},

'a303eac3-106b-4534-96b7-92a771b1dc3b':
{
	desc: '隱藏GoGoGame',
	page: { 4: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#MainPageAd2 ~ iframe[src*="/TopArticle_"] ~ div { display: none; }');
	}
},

'f6f55623-02e3-4174-8de6-5d66086a9846':
{
	desc: '隱藏投票格',
	page: { 4: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('\
		#MainPageAd2 ~ link + script + div[style] \
			{ display: none; } \
		');
	}
},

'b44ee3a6-950e-4b2a-b99a-399b6384bcce':
{
	desc: '隱藏搜尋列上下空白',
	page: { 28: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('\
		#ctl00_ContentPlaceHolder1_MiddleAdSpace1 > div { padding: 0 !important; } \
		');

		if($d.pageName() == 'topics')
			AN.util.stackStyle('\
			.Topic_FunctionPanel { margin-top: 0; } \
			#ctl00_ContentPlaceHolder1_MiddleAdSpace1 { margin-top: 5px !important; } \
			');
		else
			AN.util.stackStyle('\
			td[valign="bottom"] > br:first-child { display: none; } \
			td[valign="bottom"] > p { margin: 0; } \
			');
	}
},

'1ada74ac-9bae-47b2-914b-f1556dbab1a2':
{
	desc: '隱藏討論區選單',
	page: { 28: false },
	type: 3,
	once: function()
	{
		if($d.pageName() == 'topics')
			AN.util.stackStyle('#forum_list, #forum_list + br { display: none; }');
		else
			AN.util.stackStyle('#ctl00_ContentPlaceHolder1_topics_form > div + table table:first-child { display: none; }');
	}
},

'4bf6619f-2cd8-4aa2-a54a-e7d7255e8603':
{
	desc: '隱藏熱門關鍵字',
	page: { 30: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#ctl00_ContentPlaceHolder1_lb_HitSearchs { display: none; }');
	}
},

'a5d7f8f0-99fc-4aaf-8c65-373b17cfcf69':
{
	desc: '隱藏投票站連結(如有)',
	page: { 60: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#ctl00_ContentPlaceHolder1_MiddleAdSpace1 { display: none; }');
	}
},

'f41e288e-cd1d-4649-a396-83d92d99ded8':
{
	desc: '隱藏紅人榜',
	page: { 4: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#ctl00_ContentPlaceHolder1_HotPeoples, #ctl00_ContentPlaceHolder1_HotPeoples + br { display: none; }');
	}
},

'a2257837-e528-4b4c-a794-84fc4ccca225':
{
	desc: '隱藏討論區守則',
	page: { 4: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('.Topic_ListPanel > .DivBoxContainer { display: none; }');
	}
},

'74cd7f38-b0ad-4fca-ab39-673b0e2ee4c7':
{
	desc: '修正跳頁控件位置',
	page: { 32: true },
	type: 3,
	once: function()
	{
		AN.util.stackStyle($.sprintf('div[style] > div[style^="%s: center"] { margin: 0 100px; }', $.browser.msie ? 'TEXT-ALIGN' : 'text-align'));
	}
},

'0941e559-3875-445a-9c56-799987fbdf87':
{
	desc: '隱藏名稱欄物件',
	page: { 32: false },
	type: 3,
	options: {
		bHideAvatar: { desc: '隱藏高級會員頭像', defaultValue: false, type: 'checkbox' },
		bHideMemberLevel: { desc: '隱藏會員級別圖片', defaultValue: false, type: 'checkbox' },
		bHideAward: { desc: '隱藏(善)圖像', defaultValue: false, type: 'checkbox' }
	},
	once: function()
	{
		var css = [];
		$.each({
			bHideAvatar: 'div[id^="ThreadUser"] > a',
			bHideMemberLevel: 'div[id^="ThreadUser"] > img',
			bHideAward: 'div[id^="ThreadUser"] ~ *'
		}, function(name, selector)
		{
			if(AN.util.getOptions(name)) css.push(selector);
		});

		AN.util.stackStyle(css.join(',') + ' { display: none; }');
	}
},

'a0203b01-7565-46e1-a52e-260dd4d485a1':
{
	desc: '隱藏引用',
	page: { 32: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('.repliers_right blockquote { display: none; }');
	}
},

'd0ac656c-e602-4852-843b-f776d8a976f4':
{
	desc: '隱藏評分格',
	page: { 32: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#DivMarkThread { display: none; }');
	}
},

'96df064c-efb6-44be-9251-4a7751a45504':
{
	desc: '隱藏Facebook按扭',
	page: { 32: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#DivMarkThread + table { display: none; }');
	}
},

'eec2a29d-44b5-470b-bffd-2da4184428f4':
{
	desc: '隱藏留名按扭',
	page: { 32: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('div > a[id^="laumingHref"] { display: none; }');
	}
},

'2c7998ad-10cc-4bca-9f2c-85f1771356c2':
{
	desc: '隱藏投訴文章按扭',
	page: { 32: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('.repliers_right a[href^="contactus.aspx?messageid="] { display: none; }');
	}
},

'26eaf7f8-d260-4b42-b6d9-08b235f56d43':
{
	desc: '隱藏引用原文按扭',
	page: { 32: false },
	type: 3,
	options: { bCDROMMode: { desc: '同時隱藏快速引用按扭及登入提示 [CD-ROM專用]', defaultValue: false, type: 'checkbox' } },
	once: function()
	{
		var sSelector = '.repliers_right a[href^="post.aspx?mt=Y&rid="]';

		if(AN.util.getOptions('bCDROMMode'))
		{
			sSelector += ', .repliers_right a[href*="QuoteReply("],#ct100_ContentPlaceHolder1_QuickReplyLoginTable';
		}

		AN.util.stackStyle(sSelector + '{ display: none; }');
	}
},

'2c026f6b-f252-4a58-b2ac-706fcd052fb6':
{
	desc: '隱藏快速回覆組件',
	page: { 32: false },
	type: 3,
	options:
	{
		bRemNameRow: { desc: '隱藏名字列', defaultValue: false, type: 'checkbox' },
		bRemTopicRow: { desc: '隱藏主旨列', defaultValue: false, type: 'checkbox' },
		bRemClassicRow: { desc: '隱藏經典表情圖示列', defaultValue: false, type: 'checkbox' },
		bRemTempRow: { desc: '隱藏附加表情圖示列(如有)', defaultValue: false, type: 'checkbox' },
		bRemPreviewRow: { desc: '隱藏預覽列', defaultValue: false, type: 'checkbox' }
	},
	once: function()
	{
		if(!AN.util.isLoggedIn()) return;

		var jRows = $('#ctl00_ContentPlaceHolder1_QuickReplyTable tbody:eq(2)').children();
		if(AN.util.getOptions('bRemNameRow')) jRows.eq(0).hide();
		if(AN.util.getOptions('bRemTopicRow')) jRows.eq(1).hide();
		if(AN.util.getOptions('bRemClassicRow')) jRows.eq(3).hide();
		if(AN.util.getOptions('bRemTempRow') && jRows.length > 5) jRows.eq(3).nextAll(':not(:last)').hide();
		if(AN.util.getOptions('bRemPreviewRow')) jRows.last().hide();
	}
},

'c1daa2db-8315-48bb-b26b-7ea99481ce28':
{
	desc: '隱藏私人訊息列表',
	page: { 64: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#ctl00_ContentPlaceHolder1_UpdatePanelPM, #ctl00_ContentPlaceHolder1_UpdatePanelPM + br { display: none; }');
	}
},

'1e2a7c96-a096-4a45-9909-c196ddabc286':
{
	desc: '隱藏紅人榜記錄',
	page: { 64: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#ctl00_ContentPlaceHolder1_HotPeoples, #ctl00_ContentPlaceHolder1_HotPeoples + br { display: none; }');
	}
},

'222f0c01-1ebd-49d6-b7f4-b1b7fc60ca40':
{
	desc: '隱藏起底列表',
	page: { 64: false },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('#ctl00_ContentPlaceHolder1_BookmarkTable { display: none; }');
	}
},

'e424fe8d-852b-4239-b797-6aa682e68c39':
{
	desc: '修正表格闊度',
	page: { 1024: true },
	type: 3,
	once: function()
	{
		AN.util.stackStyle('table[width="800"] { width: 100%; }');
	}
}

}};
