/*
    Copyright (C) 2008  向日

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOLE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name Helianthus.Annuus 3: Layout Designer
// @namespace http://code.google.com/p/helianthus-annuus/
// @description by 向日
// @include http://forum*.hkgolden.com/*
// @run-at document-start
// ==/UserScript==

(function()
{

var window = (typeof unsafeWindow != 'undefined') ? unsafeWindow : (typeof contentWindow != 'undefined') ? contentWindow : this;
var AN = window.AN || (window.AN = { temp: [], mod: {} });

if(AN.initialized) return; // for Chrome which interestingly executes user scripts even when injecting xhr HTML into an element

AN.temp.push(function()
{
	var JSON = window.JSON;
	var $, jQuery = $ = window.jQuery;

	AN.mod['Layout Designer'] =
	{
		ver: '1.1.0',
		fn: {

'5e173905-9c47-4f37-8d3f-4c31ea871115':
{
	desc: '隱藏頂部按扭',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('.TopMenuBox { visibility: hidden; }');
		//$('.TopMenuBox').css('visibility', 'hidden');
	}
},

'7af1060d-d38c-40b9-b16b-df1bb799cb74':
{
	desc: '隱藏上方Logo列',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('.TopBannerBox { display: none; }');
		//$('.TopBannerBox').hide();
	}
},

'd0164ba6-a5a2-4850-ab67-658b840fd3ef':
{
	desc: '隱藏繁簡轉換及分享這頁',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('\
		.PageMiddleFunctions { height: 5px; } \
		.PageMiddleFunctions > div { display: none; } \
		');
		//$('.PageMiddleFunctions').height(5).children().hide();
	}
},

'62156da3-5894-489d-a766-7349982a6d40':
{
	desc: '隱藏左側連結欄項目',
	page: { 65534: true },
	type: 3,
	options:
	{
		bRemoveColumn: { desc: '隱藏整欄(登入頁除外)', defaultValue: false, type: 'checkbox' },
		bRemoveMainList: { desc: '主選單', defaultValue: false, type: 'checkbox' },
		bRemovePriceList: { desc: '最新價格', defaultValue: false, type: 'checkbox' },
		bRemoveArticleList: { desc: '最近刊登的文章', defaultValue: true, type: 'checkbox' }
	},
	once: function()
	{
		if(AN.util.getOptions('bRemoveColumn') && AN.box.sCurPage != 'login')
		{
			AN.util.addStyle('\
			.PageMiddleFunctions, .ContentPanel { padding: 0; } \
			.PageLeftPanel { display: none; } \
			table[width="99%"], table[width="800"], td[width="801"], td[width="792"] { width: 100%; } \
			#ctl00_ContentPlaceHolder1_ProfileForm td[width="8"] { display: none; } \
			');
		}
		else
		{
			var aEle = [];
			
			$.each(
			{
				bRemoveMainList: '.left_table',
				bRemovePriceList: '.left_table2_header,.left_table2',
				bRemoveArticleList: '.left_table3_header,.left_table3'
			}, function(sName, sClass)
			{
				if(AN.util.getOptions(sName))
				{
					aEle.push(sClass);
				}
			});
		
			AN.util.addStyle(aEle.join(',') + '{ display: none; }');
			//$(aEle.join(',')).hide();
		}
	}
},

'bbd5f176-c024-4684-ba98-b72da376a6eb':
{
	desc: '隱藏最底頁腳',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('.FooterPanel { display: none; }');
			//$('.FooterPanel').hide();
	}
},

'8c317615-b5e7-4b1a-a140-b7319c5b0a5b':
{
	desc: '隱藏Bookmark Bar',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('#hkg_bottombar { display: none; }');
		//$('#hkg_bottombar').hide();
	}
},

'd1dc862f-a7b3-4b29-a50f-440fc9c5fef0':
{
	desc: '縮短Bookmark Bar',
	page: { 65534: true },
	type: 3,
	once: function()
	{
		AN.util.addStyle('#hkg_bottombar { width: auto; }');
		//$('#hkg_bottombar').width('auto');
	}
},

'02837e6a-3dd7-4c73-a155-90d6f6edd8f9':
{
	desc: '拉闊頁面',
	page: { 65534: true },
	type: 3,
	options: { nPageWidth: { desc: '頁面闊度 [可設定為auto, 80%, 1000px等]', defaultValue: 'auto', type: 'text' } },
	once: function()
	{
		AN.util.addStyle($.sprintf('\
		.PageWidthContainer { width: %s; } \
		table[width="99%"], table[width="800"], td[width="801"], td[width="792"] { width: 100%; } \
		#ctl00_ContentPlaceHolder1_ProfileForm td[width="8"] { display: none; } \
		',
		AN.util.getOptions('nPageWidth')
		));
	}
},

'8d53fef9-818f-46d1-99b8-5e199453b360':
{
	desc: '隱藏討論區資訊',
	page: { 28: false, 32:false },
	type: 3,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_lb_UserName').up('table', 2).hide().next().find('tr:eq(1)').hide();
	}
},

'b44ee3a6-950e-4b2a-b99a-399b6384bcce':
{
	desc: '隱藏搜尋列上下空白',
	page: { 28: false },
	type: 3,
	once: function()
	{
		$('#searchstring').up('tr', 1).prev().hide().up('table').css('border-collapse', 'collapse');
		$('#ctl00_ContentPlaceHolder1_MiddleAdSpace1').find('tr:first').hide();
	}
},

'1ada74ac-9bae-47b2-914b-f1556dbab1a2':
{
	desc: '隱藏討論區選單',
	page: { 28: false },
	type: 3,
	once: function()
	{
		$('#forum_list').up('tr').hide();
	}
},

'c73317d9-f2c4-465a-bc56-f0f817f7eaf6':
{
	desc: 'Opera: 修正發表按扭位置',
	page: { 16: $.browser.opera || 'disabled' },
	type: 3,
	once: function()
	{
		$('#searchstring').up('td').prev().attr('valign', 'top');
	}
},

'4bf6619f-2cd8-4aa2-a54a-e7d7255e8603':
{
	desc: '隱藏熱門關鍵字',
	page: { 30: false },
	type: 3,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_lb_HitSearchs').prev('br').andSelf().hide();
	}
},

'63488147-32a6-4122-b9bb-36803e89c00f':
{
	desc: '隱藏高登公告(如有)',
	page: { 28: false },
	type: 3,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_MiddleAdSpace1').up('tr').hide();
	}
},

'f41e288e-cd1d-4649-a396-83d92d99ded8':
{
	desc: '隱藏紅人榜',
	page: { 4: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('#ctl00_ContentPlaceHolder1_HotPeoples, #ctl00_ContentPlaceHolder1_HotPeoples + br { display: none; }');
		//$('#ctl00_ContentPlaceHolder1_HotPeoples').next('br').andSelf().hide();
	}
},

'964d6cf5-9e46-43f6-ba1a-b11adf1292b1':
{
	desc: '隱藏高級會員頭像',
	page: { 32: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('img[alt="Logo"] { display: none; }');
	}
},

'9aebeb97-8507-4553-995d-0903dc764ec3':
{
	desc: '隱藏會員級別圖片',
	page: { 32: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('img[src^="labels/"] { display: none; }');
	}
},

'26eaf7f8-d260-4b42-b6d9-08b235f56d43':
{
	desc: '隱藏引用原文連結',
	page: { 32: false },
	type: 3,
	options: { bCDROMMode: { desc: '同時隱藏快速引用連結及登入提示 [CD-ROM專用]', defaultValue: false, type: 'checkbox' } },
	once: function()
	{
		var sSelector = 'a[href^="post.aspx?mt=Y&rid="]';
		
		if(AN.util.getOptions('bCDROMMode'))
		{
			sSelector += ',a[href*="QuoteReply("],#ct100_ContentPlaceHolder1_QuickReplyLoginTable';
		}
		
		AN.util.addStyle(sSelector + '{ display: none; }');
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

		var jTbody = $('#ctl00_ContentPlaceHolder1_QuickReplyTable tbody:eq(2)');
		if(AN.util.getOptions('bRemNameRow')) jTbody.children('tr:eq(0)').hide();
		if(AN.util.getOptions('bRemTopicRow')) jTbody.children('tr:eq(1)').hide();
		if(AN.util.getOptions('bRemClassicRow')) jTbody.children('tr:eq(3)').hide();
		if(AN.util.getOptions('bRemTempRow') && jTbody.children().length > 5) jTbody.children('tr:eq(4)').next().andSelf().hide();
		if(AN.util.getOptions('bRemPreviewRow')) jTbody.children('tr:last').hide();
	}
},

'1e2a7c96-a096-4a45-9909-c196ddabc286':
{
	desc: '隱藏紅人榜記錄',
	page: { 64: false },
	type: 3,
	once: function()
	{
		AN.util.addStyle('#ctl00_ContentPlaceHolder1_HotPeoples, #ctl00_ContentPlaceHolder1_HotPeoples + br { display: none; }')
		//$('#ctl00_ContentPlaceHolder1_HotPeoples').next().andSelf().remove();
	}
}

}}; // end mod

}); // end push

})(); // end anonymous