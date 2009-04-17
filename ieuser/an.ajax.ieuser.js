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
// @name Helianthus.Annuus 3: AJAX Integrator
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

	AN.mod['AJAX Integrator'] =
	{
		ver: '1.0.1',
		fn: {


'b17a0463-e46c-4420-a8f5-f169fac20aec':
{
	desc: 'AJAX化頁面讀取',
	page: { 32: true },
	type: 7,
	options:
	{
		bAjaxifyPageChange_R: { desc: 'AJAX化轉頁', defaultValue: true, type: 'checkbox' },
		bShowPageNo: { desc: '顯示資料: 本頁頁數', defaultValue: true, type: 'checkbox' },
		bAddGetBtn_R: { desc: '加入讀取回覆按扭', defaultValue: true, type: 'checkbox' },
		bAutoRefresh_R: { desc: '預設啟用自動更新', defaultValue: false, type: 'checkbox' },
		bAddToggleAutoBtn_R: { desc: '加入切換自動更新按扭', defaultValue: false, type: 'checkbox' },
		nRefreshInterval_R: { desc: '自動更新間隔(秒)', defaultValue: 0, type: 'text' },
		bAjaxifyReplying: { desc: 'AJAX化回覆', defaultValue: true, type: 'checkbox' }
	},
	once: function(jDoc)
	{
		jDoc.defer(1, '移除原有轉頁功能', function()
		{
			window.changePage = $.blank;
		});

		var changePage = function(event)
		{
			event.preventDefault();

			clearTimeout(tRefresh);
			AN.shared('log', '正在準備轉頁...');

			oCache[nCurPageNo] =
			{
				jBoxBodies: $('select[name=page]:first').up('tbody'),
				jReplies: $('.repliers').up('table')
			};

			var jThis = $(this);
			var sTarget = jThis.is('a') ? AN.util.getPageNo(this.href) : jThis.val();
			var changeReplies = function(jReplies)
			{
				$('.repliers').up('table').each(function(i)
				{
					if(i == 0 && nCurPageNo == 1) $(this).remove();
					else $(this).next().andSelf().remove();
				});

				jReplies.each(function(i)
				{
					if(i == 0 && sTarget == 1) $('strong:first').up('table').before(this);
					else jEndTable.before(this).before('<table><tr><td></td></tr></table>');
				});

				scrollTo(0, 0);
				$('#an-info-curpage').text(sTarget);
				nCurPageNo = sTarget * 1;
			};

			if(oCache[sTarget])
			{
				AN.shared('log2', '正從快取中讀取資料...');
				changeReplies(oCache[sTarget].jReplies);
				updatePageBoxes(oCache[sTarget].jBoxBodies);
				getReplies();
				AN.shared('log', '轉頁完成');
			}
			else
			{
				AN.shared('log2', $.sprintf('正在讀取第%s頁...', sTarget));
				$.get(AN.util.getURL(sTarget), function(sHTML)
				{
					var jNewDoc = $.doc(sHTML);
					var jReplies = jNewDoc.find('.repliers').up('table');

					if(!jReplies.length) return AN.shared('log', '下一頁找不到回覆, 可能是本帖部份回覆被刪所致');

					changeReplies(jReplies);
					updatePageBoxes(jNewDoc);
					AN.modFn.execMods(jReplies.add(jPageBoxes));
					if(bAutoRefresh) setNextRefresh();
				});
			}
		};

		var updatePageBoxes = function(jTarget)
		{
			jPageBoxes.html(jTarget.find('select[name=page]:first').up('tbody').clone()).find('select').val(nCurPageNo);
			addEvents();
		};

		var addEvents = function()
		{
			jPageBoxes.find('a').click(changePage).end().find('select').change(changePage);
		};

		var getReplies = function(bIsManual)
		{
			clearTimeout(tRefresh);
			if(jPageBoxes.eq(0).find('option:selected').next().length) return bIsManual ? AN.shared('log', '已存在下一頁') : null;
			if(nCurPageNo == 21) return AN.shared('log', '1001!');

			AN.shared('log', '正在讀取最新回覆...');
			$.get(AN.util.getURL(nCurPageNo), function(sHTML)
			{
				var jNewDoc = $.doc(sHTML);
				var jNewReplies = jNewDoc.find('.repliers').up('table');

				if(!jNewReplies.length)
				{
					AN.shared('log', '回覆讀取失敗!');
				}
				else
				{
					jNewReplies = jNewReplies.filter($.sprintf(':gt(%s)', $('.repliers').length - 1));
					var nNew = jNewReplies.length;

					if(nNew) // has new replies
					{
						$('strong:first').text(jNewDoc.find('strong:first').text());

						jNewReplies.each(function()
						{
							jEndTable.before(this).before('<table><tr><td></td></tr></table>');
						});
						AN.shared('log', $.sprintf('加入%s個新回覆', nNew));
					}

					if(jPageBoxes.eq(0).find('option').length != jNewDoc.find('select[name=page]:first').children().length) // has nextpage
					{
						updatePageBoxes(jNewDoc);
						AN.shared('log', '發現下一頁, 連結建立');
						AN.modFn.execMods(jPageBoxes.add(jNewReplies));
						return;
					}

					if(nNew) AN.modFn.execMods(jNewReplies);
					else AN.shared('log', '沒有新回覆');
				}

				if(bAutoRefresh)
				{
					setNextRefresh();
					AN.shared('log2', $.sprintf('%s秒再次讀取回覆...', nInterval));
				}
			});
		};

		var setNextRefresh = function()
		{
			tRefresh = setTimeout(getReplies, nInterval * 1000);
		};

		var jPageBoxes = AN.jPageBoxes = $('select[name=page]').up('table');
		var jEndTable = jPageBoxes.eq(1).up('table', 2).prev();
		var nCurPageNo = AN.util.getCurPageNo();
		var oCache = {};

		if(AN.util.getOptions('bAjaxifyPageChange_R')) addEvents();
		if(AN.util.getOptions('bShowPageNo')) AN.shared('addInfo', $.sprintf('本頁頁數: <a id="an-info-curpage" href="%s">%s</a>', location.href, nCurPageNo));

		if(AN.util.getOptions('bAddGetBtn_R')) jDoc.defer(2, '加入讀取按扭', function(){ AN.shared('addButton', '讀取最新回覆', function(){ getReplies(true); }); });

		var tRefresh;
		var bAutoRefresh = AN.util.getOptions('bAutoRefresh_R');
		var nInterval = AN.util.getOptions('nRefreshInterval_R');
		if(nInterval < 30) nInterval = 30;

		if(bAutoRefresh) setNextRefresh();
		if(AN.util.getOptions('bAddToggleAutoBtn_R')) AN.shared('addButton', '切換自動更新', function()
		{
			if(bAutoRefresh)
			{
				clearTimeout(tRefresh);
				AN.shared('log', '已停用自動更新');
			}
			else
			{
				setNextRefresh();
				AN.shared('log', '已啟用自動更新');
			}
			bAutoRefresh = !bAutoRefresh;
		});

		if(AN.util.getOptions('bAjaxifyReplying'))
		{
			$('#aspnetForm').submit(function(event)
			{
				clearTimeout(tRefresh);
				event.preventDefault();
				AN.shared('log', '正在發送回覆...');
				$.post(location.href, $('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24btn_Submit.x=0&ctl00%24ContentPlaceHolder1%24btn_Submit.y=0', function()
				{
					$('#ctl00_ContentPlaceHolder1_messagetext').val('');
					$('#previewArea').empty();
					AN.shared('log', '回覆發送完成');
					getReplies();
				});
			});
		}
	}
},

'bc2521cd-cf65-4cc5-ac9d-4fedef3c3a97':
{
	desc: 'AJAX式列表更新',
	page: { 4: true },
	type: 7,
	options:
	{
		//bAjaxifyPageChange_T: { desc: 'AJAX化轉頁', defaultValue: true, type: 'checkbox' },
		bAddGetBtn_T: { desc: '加入更新列表按扭', defaultValue: true, type: 'checkbox' },
		bAutoRefresh_T: { desc: '預設啟用自動更新', defaultValue: false, type: 'checkbox' },
		bAddToggleAutoBtn_T: { desc: '加入切換自動更新按扭', defaultValue: false, type: 'checkbox' },
		nRefreshInterval_T: { desc: '自動更新間隔(秒)', defaultValue: 30, type: 'text' }
	},
	once: function(jDoc)
	{
		var refreshTopics = function(bRetry)
		{
			clearTimeout(tRefresh);

			if(!bRetry) AN.shared('log', '正在讀取最新列表...');
			var nStart = $.time();
			$.get(AN.util.getURL(), function(sHTML)
			{
				var aTopics = $.doc(sHTML).topics();
				if(aTopics)
				{
					$.each($('body').topics(), function(i)
					{
						this.jThis.replaceWith(aTopics[i].jThis);
					});

					AN.modFn.execMods(aTopics[0].jThis.parent());

					AN.shared('log', $.sprintf('列表更新完成(%sms)', $.time() - nStart));
				}
				else if(!bRetry)
				{
					AN.shared('log', '列表讀取失敗, 可能是由於session timeout, 重新讀取中...');
					return refreshTopics(true);
				}
				else AN.shared('log', '列表讀取失敗, 原因不明!');

				if(bAutoRefresh)
				{
					AN.shared('log2', $.sprintf('%s秒後再次重新整埋....', nInterval));
					setNextRefresh();
				}
			});
		};
		var setNextRefresh = function()
		{
			tRefresh = setTimeout(refreshTopics, nInterval * 1000);
		};

		if(AN.util.getOptions('bAddGetBtn_T')) jDoc.defer(2, '加入讀取按扭', function(){ AN.shared('addButton', '更新列表', function(){ refreshTopics(); }); });

		var tRefresh;
		var bAutoRefresh = AN.util.getOptions('bAutoRefresh_T');
		var nInterval = AN.util.getOptions('nRefreshInterval_T');
		if(nInterval < 30) nInterval = 30;

		if(bAutoRefresh) setNextRefresh();
		if(AN.util.getOptions('bAddToggleAutoBtn_T')) AN.shared('addButton', '切換自動更新', function()
		{
			if(bAutoRefresh)
			{
				clearTimeout(tRefresh);
				AN.shared('log', '已停用自動更新');
			}
			else
			{
				setNextRefresh();
				AN.shared('log', '已啟用自動更新');
			}
			bAutoRefresh = !bAutoRefresh;
		});
	}
}

}}; // end mod

}); // end push

})(); // end anonymous