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

var window = (typeof contentWindow != 'undefined') ? contentWindow : ((typeof unsafeWindow != 'undefined') ? unsafeWindow : this);
var AN = window.AN || (window.AN = { temp: [], mod: {} });

if(AN.initialized) return; // for Chrome which interestingly executes user scripts even when injecting xhr HTML into an element

AN.temp.push(function()
{
	var JSON = window.JSON;
	var $ = AN.jQuery;

	AN.mod['AJAX Integrator'] =
	{
		ver: '3.2.1',
		author: '向日',
		fn: {


'b17a0463-e46c-4420-a8f5-f169fac20aec':
{
	desc: 'AJAX化頁面讀取',
	page: { 32: true },
	type: 7,
	options:
	{
		bCheckOnBottom: { desc: '到頁底自動更新帖子', defaultValue: true, type: 'checkbox' },
		nCheckInterval: { desc: '自動更新間隔(秒)', defaultValue: 30, type: 'text' },
		bAddCheckBtn: { desc: '加入更新帖子按扭', defaultValue: true, type: 'checkbox' },
		bAppendReplies: { desc: '延展帖子回覆', defaultValue: false, type: 'checkbox' },
		bAjaxifyReplying: { desc: 'AJAX化回覆', defaultValue: true, type: 'checkbox' },
		bShowPageNo: { desc: '顯示資料: 本頁頁數', defaultValue: true, type: 'checkbox' }
	},
	once: function(jDoc)
	{
		jDoc.defer(1, '移除原有轉頁功能', function()
		{
			window.changePage = $.blank;
		});

		var handlePage = function(jScope)
		{
			var jPageBoxes = $('select[name=page]', jScope).up('table');

			oPages[nCurPageNo] =
			{
				jDiv: $('.repliers:first', jScope).up('div'),
				jEndTable: jPageBoxes.eq(1).up('table', 3).prev(),
				jPageBoxes: jPageBoxes
			};

			if(!oPages.nLastest || oPages.nLastest < nCurPageNo)
			{
				oPages.nLastest = nCurPageNo;
			}

			jPageBoxes.find('a').click(getPage);
			jPageBoxes.find('select').data('an-pageNo', nCurPageNo).change(getPage);
		};

		var getPage = function(event)
		{
			AN.shared('log', '正在準備轉頁...');
			if(event) event.preventDefault();
			toggleTimer(false);

			var handleLeftOver = function(jDiv)
			{
				if(!AN.util.getOptions('bAppendReplies')) oPages[nCurPageNo].jDiv.hide();
				if(event) (jDiv || oPages[nTargetPageNo].jDiv)[0].scrollIntoView();
				$('#an-info-curpage').text($.sprintf('第%s頁', nTargetPageNo)).attr('href', AN.util.getURL(nTargetPageNo));
				nCurPageNo = nTargetPageNo;
			};

			var nTargetPageNo;
			if(!event)
			{
				nTargetPageNo = nCurPageNo + 1;
			}
			else
			{
				var jThis = $(this);

				if(jThis.is('a'))
				{
					nTargetPageNo = AN.util.getPageNo(this.href) * 1;
				}
				else
				{
					nTargetPageNo = jThis.val() * 1;

					// this is to workaround a Google Chrome problem
					var jTemp = $('<span></span>');
					jThis.replaceWith(jTemp);
					jTemp.replaceWith(jThis);

					jThis.val(jThis.data('an-pageNo'));
				}
			}

			if(oPages[nTargetPageNo])
			{
				AN.shared('log2', '正從快取中讀取資料...');
				oPages[nTargetPageNo].jDiv.show();
				handleLeftOver();
				AN.shared('log', '轉頁完成');
				getReplies();
			}
			else
			{
				AN.shared('log2', $.sprintf('正在讀取第%s頁...', nTargetPageNo));
				$.get(AN.util.getURL(nTargetPageNo), function(sHTML)
				{
					var jNewDiv = $.doc(sHTML).find('.repliers:first').up('div');
					//if(!jNewDiv.length) return AN.shared('log', '下一頁找不到回覆, 可能是本帖部份回覆被刪所致');
					jNewDiv.children(':last').remove(); // quick reply

					if(nTargetPageNo > oPages.nLastest)
					{
						jNewDiv.insertAfter(oPages[oPages.nLastest].jDiv);
					}
					else
					{
						for(var sPage=1; sPage<=oPages.nLastest; sPage++)
						{
							if(oPages[sPage] && nTargetPageNo < sPage)
							{
								jNewDiv.insertBefore(oPages[sPage].jDiv);
								break;
							}
						}
					}

					handleLeftOver(jNewDiv);
					handlePage(jNewDiv);

					AN.shared('log', '轉頁完成');
					AN.modFn.execMods(jNewDiv);

					toggleTimer(true, false);
				});
			}
		};

		var getReplies = function(bGetNext)
		{
			toggleTimer(false);

			if(oPages[nCurPageNo].jPageBoxes.eq(0).find('option:selected').next().length)
			{
				if(bGetNext && AN.util.getOptions('bAppendReplies')) getPage(null);
				return;
			}

			if(nCurPageNo == 21)
			{
				AN.shared('log', '1001!');
				return;
			}

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
					jNewReplies = jNewReplies.filter($.sprintf(':gt(%s)', oPages[nCurPageNo].jDiv.find('.repliers').length - 1));
					var nNew = jNewReplies.length;

					if(nNew) // has new replies
					{
						oPages[nCurPageNo].jDiv.find('strong:first').text(jNewDoc.find('strong:first').text());

						jNewReplies.each(function()
						{
							oPages[nCurPageNo].jEndTable.before($(this).add($(this).next()));
						});
						AN.shared('log', $.sprintf('加入%s個新回覆', nNew));
					}

					if(oPages[nCurPageNo].jPageBoxes.eq(0).find('option').length != jNewDoc.find('select[name=page]:first').children().length) // has nextpage
					{
						oPages[nCurPageNo].jPageBoxes.replaceWith(jNewDoc.find('select[name=page]').up('table'));
						handlePage(oPages[nCurPageNo].jDiv);
						AN.shared('log', '發現下一頁, 連結建立');
						AN.modFn.execMods(oPages[nCurPageNo].jPageBoxes.add(jNewReplies));
						if(bGetNext && AN.util.getOptions('bAppendReplies')) getPage(null);
						return;
					}

					if(nNew) AN.modFn.execMods(jNewReplies);
					else AN.shared('log', '沒有新回覆');
				}

				toggleTimer(true, true);
			});
		}

		var checkBottom = function()
		{
			var nDifference = oPages[nCurPageNo].jDiv.offset().top + oPages[nCurPageNo].jDiv.height() - $().scrollTop() - $.winHeight();
			if(nDifference < 500 && nDifference > -500)
			{
				getReplies(true);
			}
			else
			{
				tCheck = setTimeout(arguments.callee, 500);
			}
		};

		var toggleTimer = function(bToSet, bDeferCheck)
		{
			if(bToSet)
			{
				if(AN.util.getOptions('bCheckOnBottom')) tCheck = setTimeout(checkBottom, bDeferCheck ? nInterval : 500);
			}
			else
			{
				clearTimeout(tCheck);
			}
		};

		var nCurPageNo = jDoc.pageNo();
		var oPages = {};
		var tCheck;

		var nInterval = AN.util.getOptions('nCheckInterval');
		if(nInterval < 30) nInterval = 30;
		nInterval *= 1000;

		handlePage();
		$('#newmessage').insertAfter(oPages[nCurPageNo].jDiv);
		toggleTimer(true, false);

		if(AN.util.getOptions('bAddCheckBtn')) jDoc.defer(2, '加入讀取按扭', function(){ AN.shared('addButton', '更新帖子', function(){ getReplies(true); }); });
		if(AN.util.getOptions('bShowPageNo')) AN.shared('addInfo', $.sprintf('本頁頁數: <a id="an-info-curpage" href="%s">第%s頁</a>', location.href, nCurPageNo));
		if(AN.util.getOptions('bAjaxifyReplying'))
		{
			$('#aspnetForm')[0].onsubmit = function() // jQuery submit function just wont work when triggering the click event of the submit btn
			{
				toggleTimer(false);
				AN.shared('log', '正在發送回覆...');
				$.post(location.href, $('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24btn_Submit.x=0&ctl00%24ContentPlaceHolder1%24btn_Submit.y=0', function()
				{
					$('#ctl00_ContentPlaceHolder1_messagetext').val('');
					$('#previewArea').empty();
					AN.shared('log', '回覆發送完成');
					getReplies();
				});

				return false;
			};
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
				var jNewTopics = $.doc(sHTML).topics();
				if(jNewTopics && jNewTopics.length)
				{
					$(document.body).topics().jTbody.replaceWith(jNewTopics.jTbody);

					AN.modFn.execMods(jNewTopics.jTbody);

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

		if(AN.util.getOptions('bAddGetBtn_T')) jDoc.defer(2, '加入更新按扭', function(){ AN.shared('addButton', '更新列表', function(){ refreshTopics(); }); });

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