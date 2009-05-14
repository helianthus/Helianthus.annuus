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

AN.temp.push(function()
{
	var JSON = window.JSON;
	var $, jQuery = $ = window.jQuery;

	AN.mod['Layout Designer'] =
	{
		ver: '1.0.2',
		fn: {

'5e173905-9c47-4f37-8d3f-4c31ea871115':
{
	desc: '隱藏頂部按扭',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		$('.bg_top table:eq(1) tr:first').css('visibility', 'hidden');
	}
},

'7af1060d-d38c-40b9-b16b-df1bb799cb74':
{
	desc: '移除上方Logo列',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		$('#ctl00_TopBarHomeLink').up('tr', 1).remove();
		$('td[height=144]').removeAttr('height');
	}
},

'd0164ba6-a5a2-4850-ab67-658b840fd3ef':
{
	desc: '移除繁簡轉換及分享這頁',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		$('#ctl00_TraditionalLink').up('tr').html('<td>&nbsp;</td>');
	}
},

'62156da3-5894-489d-a766-7349982a6d40':
{
	desc: '移除左側連結欄項目',
	page: { 65534: true },
	type: 3,
	options:
	{
		bRemoveColumn: { desc: '移除整欄(登入頁除外)', defaultValue: false, type: 'checkbox' },
		bRemoveMainList: { desc: '主選單', defaultValue: false, type: 'checkbox' },
		bRemovePriceList: { desc: '最新價格', defaultValue: false, type: 'checkbox' },
		bRemoveArticleList: { desc: '最近刊登的文章', defaultValue: true, type: 'checkbox' }
	},
	once: function()
	{
		if(AN.util.getOptions('bRemoveColumn') && AN.box.sCurPage != 'login')
		{
			var j937 = $('td[width=937]');

			j937.children(':first').andSelf().width('100%');
			$('td[width=806]').width('100%').siblings().remove();

			$.each(
			{
				32: function()
				{
					j937.nextAll().remove();
				},
				1088: function()
				{
					$('table[width=800]:first').find('td:first').andSelf().width('100%');
				},
				65534: function()
				{
					j937.siblings().remove();
				}
			}, function(sNo)
			{
				if(AN.box.nCurPage & sNo)
				{
					this();
					return false;
				}
			});
		}
		else
		{
			var jPriceTr = $('table.left_table2:first').up('tr');

			if(AN.util.getOptions('bRemoveMainList'))
			{
				jPriceTr.prevAll(':gt(1)').remove();
			}

			if(AN.util.getOptions('bRemoveArticleList'))
			{
				jPriceTr.nextAll().remove();
			}

			if(AN.util.getOptions('bRemovePriceList'))
			{
				jPriceTr.prevAll(':lt(2)').andSelf().remove();
			}
		}
	}
},

'bbd5f176-c024-4684-ba98-b72da376a6eb':
{
	desc: '移除最底頁腳',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		$('#aspnetForm > tbody > tr:last').remove();
	}
},

'8c317615-b5e7-4b1a-a140-b7319c5b0a5b':
{
	desc: '移除Bookmark Bar',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		$('#hkg_bottombar').remove();
	}
},

'02837e6a-3dd7-4c73-a155-90d6f6edd8f9':
{
	desc: '拉闊頁面',
	page: { 65534: false },
	type: 3,
	once: function()
	{
		$('table,td').filter(function(){ return this.width.match(/^(?:955|937|806|800|792)$/); }).width('100%');
	}
},

'8d53fef9-818f-46d1-99b8-5e199453b360':
{
	desc: '移除討論區資訊',
	page: { 28: false, 32:false },
	type: 3,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_lb_UserName').up('table', 2).hide();
	}
},

'b44ee3a6-950e-4b2a-b99a-399b6384bcce':
{
	desc: '移除搜尋列上下空白',
	page: { 28: false },
	type: 3,
	once: function()
	{
		$('#searchstring').up('tr', 1).prev().remove().end().up('table').css('border-collapse', 'collapse').find('form').css('margin', 0);
		$('#ctl00_ContentPlaceHolder1_MiddleAdSpace1').find('tr:first').remove();
		$('#forum_list').parent().css('margin', 0).prev('br').remove();
	}
},

'1ada74ac-9bae-47b2-914b-f1556dbab1a2':
{
	desc: '移除討論區選單',
	page: { 28: false },
	type: 3,
	once: function()
	{
		$('#forum_list').up('tr').remove();
	}
},

'c73317d9-f2c4-465a-bc56-f0f817f7eaf6':
{
	desc: 'Opera: 修正發表按扭位置',
	page: { 16: $.browser.opera },
	type: 3,
	once: function()
	{
		$('#searchstring').up('td').prev().attr('valign', 'top');
	}
},

'4bf6619f-2cd8-4aa2-a54a-e7d7255e8603':
{
	desc: '移除熱門關鍵字',
	page: { 30: false },
	type: 3,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_lb_HitSearchs').prev().andSelf().remove();
	}
},

'63488147-32a6-4122-b9bb-36803e89c00f':
{
	desc: '移除高登公告(如有)',
	page: { 28: false },
	type: 3,
	once: function()
	{
		$('#advarea').up('table').remove();
	}
},

'f41e288e-cd1d-4649-a396-83d92d99ded8':
{
	desc: '移除紅人榜',
	page: { 4: false },
	type: 3,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_HotPeoples').next('br').andSelf().remove();
	}
},

'964d6cf5-9e46-43f6-ba1a-b11adf1292b1':
{
	desc: '移除高級會員頭像',
	page: { 32: false },
	type: 3,
	infinite: function(jDoc)
	{
		jDoc.find('img[alt=Logo]').up('p').remove();
	}
},

'26eaf7f8-d260-4b42-b6d9-08b235f56d43':
{
	desc: '移除引用原文連結',
	page: { 32: false },
	type: 3,
	options: { bCDROMMode: { desc: '同時移除快速引用連結及登入提示 [CD-ROM專用]', defaultValue: false, type: 'checkbox' } },
	once: function()
	{
		if(AN.util.getOptions('bCDROMMode')) $('#ctl00_ContentPlaceHolder1_QuickReplyLoginTable').remove();
	},
	infinite: function(jDoc)
	{
		if(AN.util.getOptions('bCDROMMode'))
		{
			$.each(jDoc.replies(), function()
			{
				this.jThis.find('a:last').prev().andSelf().remove();
			});
		}
		else
		{
			$.each(jDoc.replies(), function()
			{
				this.jThis.find('a:last').remove();
			});
		}
	}
},

'2c026f6b-f252-4a58-b2ac-706fcd052fb6':
{
	desc: '移除快速回覆組件',
	page: { 32: false },
	type: 3,
	options:
	{
		bRemNameRow: { desc: '移除名字列', defaultValue: false, type: 'checkbox' },
		bRemTopicRow: { desc: '移除主旨列', defaultValue: false, type: 'checkbox' },
		bRemClassicRow: { desc: '移除經典表情圖示列', defaultValue: false, type: 'checkbox' },
		bRemTempRow: { desc: '移除附加表情圖示列(如有)', defaultValue: false, type: 'checkbox' },
		bRemPreviewRow: { desc: '移除預覽列', defaultValue: false, type: 'checkbox' }
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
	desc: '移除紅人榜記錄',
	page: { 64: false },
	type: 3,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_HotPeoples').next().andSelf().remove();
	}
}

}}; // end mod

}); // end push

})(); // end anonymous