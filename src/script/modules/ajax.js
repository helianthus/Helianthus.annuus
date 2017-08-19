AN.mod['Ajax Integrator'] = { ver: 'N/A', author: '向日', fn: {

'b17a0463-e46c-4420-a8f5-f169fac20aec':
{
	desc: 'Ajax化頁面讀取',
	page: { 32: true },
	type: 7,
	options:
	{
		viewAjaxDisplayMode: { desc: '顯示模式', type: 'select', choices: ['單頁模式', '延展模式', '延展模式(隱藏轉頁格)'], defaultValue: '延展模式' },
		nCheckInterval: { desc: '自動更新間隔(秒)', defaultValue: 30, type: 'text' },
		addViewAjaxPageLinks: { desc: '加入轉頁連結至連結元件', defaultValue: true, type: 'checkbox' },
		autoRetryAfterReplyFail: { desc: '回覆失敗時自動重試', defaultValue: false, type: 'checkbox' },
		checkOnBottom: { desc: '只有到頁底時才自動更新帖子', defaultValue: true, type: 'checkbox' }
		//bAddCheckBtn: { desc: '加入更新帖子按扭', defaultValue: true, type: 'checkbox' },
		//bAppendReplies: { desc: '延展帖子回覆', defaultValue: false, type: 'checkbox' },
		//bAjaxifyReplying: { desc: 'AJAX化回覆', defaultValue: true, type: 'checkbox' },
		//bShowPageNo: { desc: '顯示資料: 本頁頁數', defaultValue: true, type: 'checkbox' }
	},
	once: function(jDoc)
	{
		jDoc.defer(1, '移除原有轉頁功能', function()
		{
			window.changePage = $.noop;
		});

		AN.util.stackStyle('.hkg_bottombar_link[href^="javascript: BlockUser("] { display: none; }');

		var gBoxId = 1001;

		$d.bind('click.userlinkbox', function(event)
		{
			var jTarget = $(event.target);
			if(!jTarget.is('a[href^="javascript: ToggleUserDetail"]')) return;

			event.preventDefault()

			var boxId = jTarget.data('an-boxId');

			if(!boxId) {
				boxId = gBoxId++;

				jTarget
				.data('an-boxId', boxId)
				.nextAll('div[id^=ThreadUser]').attr('id', 'ThreadUser' + boxId)
			}

			window.ToggleUserDetail(boxId, jTarget.closest('[userid]')[0].id)
		});

		var pages = {};
		var curPageNo = jDoc.pageNo();
		var lastPageNo = $('select[name="page"]:first').children().length;
		var displayMode = $.inArray(AN.util.getOptions('viewAjaxDisplayMode'), this.options.viewAjaxDisplayMode.choices);

		function updateElements(jScope)
		{
			$('table[width="99%"] > tbody > tr > td > strong').text(jScope.find('table[width="99%"] > tbody > tr > td > strong:first').text());
		}

		function handleNewPage(jScope, newPageNo)
		{
			var jDiv = $('.repliers:first', jScope).up('div');

			jDiv.find('script').remove();

			if(location.search.indexOf('type=FN') !== -1) {
				var tables = $('.PageMiddlePanel > div', jScope).children();
				if(tables.length > 1) {
					tables.find('script').remove().end().slice(1).remove().appendTo(jDiv).filter('table').each(function()
					{
						var table = $(this);
						table.replaceWith(table.find('> tbody > tr > td[align] > *'));
					});
				}
			}

			jDiv.prev().prependTo(jDiv)

			if(displayMode != 2) {
				var jSelect = jDiv.parent().find('select[name="page"]');
				jSelect.data('an-pageno', jSelect.val());

				if(newPageNo > pages.last) {
					$('select[name="page"]:last').up('div', 3).replaceWith(jSelect.first().up('div', 3).clone(true))
				}
			}

			updateElements(jDiv);

			if(jScope) {
				for(var pageNo = 1; pageNo <= pages.last; pageNo++) {
					if(pages[pageNo] && newPageNo < pageNo) {
						jDiv.insertBefore(pages[pageNo]);
						break;
					}
				}

				if(pageNo > pages.last) jDiv.insertAfter(pages[pages.last]);

				AN.modFn.execMods(jDiv);
			}

			if(!pages.last || newPageNo && newPageNo > pages.last) pages.last = newPageNo || curPageNo;

			pages[newPageNo || curPageNo] = jDiv;

			return jDiv;
		}

		function changePage(targetPageNo, isAuto)
		{
			if(isWorking) return;

			if(targetPageNo < 1) return document.body.scrollIntoView();
			if(targetPageNo > lastPageNo) return document.body.scrollIntoView(false);

			var previouslyCached = !!pages[targetPageNo];

			function handlePageChange(jDiv) {
				if(displayMode === 0) pages[curPageNo].hide();
				history.pushState ? history.pushState(null, null, AN.util.getURL({ page: targetPageNo })) : location.hash = 'page=' + targetPageNo;
				if(!isAuto) jDiv[0].scrollIntoView();
				curPageNo = targetPageNo;
				AN.shared('log', '轉頁完成');
				$d.trigger({ type: 'workend', isPageChangeEnd: true, previouslyCached: previouslyCached });
			}

			$d.trigger('workstart');

			AN.shared('log', $.sprintf('正在轉至第%s頁...', targetPageNo));

			if(previouslyCached) {
				handlePageChange(pages[targetPageNo].show());
			}
			else {
				$.getDoc(AN.util.getURL({ page: targetPageNo }), function(jNewDoc)
				{
					handlePageChange(handleNewPage(jNewDoc, targetPageNo));
				});
			}
		}

		function getReplies(isAuto)
		{
			if(isWorking) return;

			if(pages.last == 41) {
				AN.shared('log', '1001!');
				return;
			}

			if(displayMode === 0 && curPageNo != lastPageNo) {
				if(!isAuto) changePage(curPageNo + 1, isAuto);
				return;
			}

			if(displayMode !== 0 && pages.last != lastPageNo) {
				changePage(pages.last + 1, isAuto);
				return;
			}

			$d.trigger('workstart');

			AN.shared('log', '正在讀取最新回覆...');

			$.getDoc(AN.util.getURL({ page: pages.last }), function(jNewDoc)
			{
				jNewDoc.find('script').remove();

				updateElements(jNewDoc);

				var jNewReplies = jNewDoc.replies();
				var jNewSelect = jNewDoc.find('select[name="page"]:first');

				var oldReplyNum = pages[pages.last].replies().length;
				var newLastPageNo = jNewSelect.children().length;

				var difference = jNewReplies.length - oldReplyNum;
				var hasNextPage = newLastPageNo > lastPageNo;

				if(difference <= 0 && !hasNextPage) {
					AN.shared('log', '沒有新回覆');
				}
				else {
					var jNewElements = $();

					if(difference > 0) {
						jNewElements = jNewElements.add(jNewReplies.slice(oldReplyNum).closest('table[width="100%"]').insertAfter(pages[pages.last].children('table[width="100%"]:last')));
						pages[pages.last].jReplies = null;
						AN.shared('log', $.sprintf('加入%s個新回覆', difference));
					}

					if(hasNextPage) {
						lastPageNo = newLastPageNo;

						if(displayMode != 2) {
							$('select[name="page"]').each(function()
							{
								var jThis = $(this);
								var max = jThis.children().length;
								while(max < newLastPageNo) {
									jThis.append($.sprintf('<option value="%(pageNo)s">%(pageNo)s</option>', { pageNo: ++max }));
								}
							});

							pages[pages.last].find('select[name="page"]').add($('select[name="page"]:last'))
								.up('div', 3)
								.replaceWith(jNewSelect.data('an-pageno', pages.last).up('div', 3));
						}

						if(displayMode === 0) {
							AN.shared('log', '發現下一頁, 連結建立');
						}
						else {
							$d.one('workend', function()
							{
								changePage(pages.last + 1, isAuto);
							});
						}
					}

					AN.modFn.execMods(jNewElements);
				}

				$d.trigger('workend');
			});
		}

		if(AN.util.isLoggedIn()) {
			$('#aspnetForm').submit(function(event)
			{
				event.preventDefault();

				$.doTimeout('autoRetryReply');

				if(isWorking) {
					AN.shared('log', '正在工作中, 完成將自動重試');
					$d.one('workend', function()
					{
						$.doTimeout('autoRetryReply', 0, function()
						{
							$('#aspnetForm').submit();
						});
					});
					return;
				}

				$d.trigger('workstart');

				AN.shared('log', '正在發送回覆...');
				$.post(location.pathname + location.search, $('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24btn_Submit.x=0&ctl00%24ContentPlaceHolder1%24btn_Submit.y=0', function(sHTML)
				{
					if($.doc(sHTML).pageName() !== 'view') {
						if(AN.util.getOptions('autoRetryAfterReplyFail')) {
							AN.shared('log', '回覆發送失敗, 5秒後重新發送...');
							$.doTimeout('autoRetryReply', 5000, function()
							{
								$('#aspnetForm').submit();
							});
						}
						else {
							AN.shared('log', '回覆發送失敗!');
						}
						$d.trigger('workend');
						return;
					}

					$('#ctl00_ContentPlaceHolder1_messagetext').val('');
					$('#previewArea').empty();
					AN.shared('log', '回覆發送完成');

					$d.trigger('workend');

					getReplies(true);
				});
			});
		}

		var isWorking = false;

		$d.bind('workstart workend', function(event){ isWorking = (event.type == 'workstart'); });

		$d.bind('click', function(event)
		{
			var jTarget = $(event.target);
			if(jTarget.parent('a').length) jTarget = jTarget.parent();
			if(!(jTarget.is('a') && jTarget.parent('div').siblings('div').children('select[name="page"]').length)) return;

			event.preventDefault();
			changePage(AN.util.getPageNo(jTarget.attr('href')));
		});

		if(displayMode == 2) {
			AN.util.stackStyle($.sprintf('%(pageDiv)s > div, %(pageDiv)s > br, %(pageDiv)s + br { display: none; }', { pageDiv: '#ctl00_ContentPlaceHolder1_view_form > div[style^="width"]' }));
		}
		else {
			$d.bind('change', function(event)
			{
				var jTarget = $(event.target);
				if(!jTarget.is('select[name="page"]')) return;

				var target = jTarget.val();
				jTarget.val(jTarget.data('an-pageno'));
				changePage(target * 1);
			});
		}

		handleNewPage();

		(function()
		{
			var jTimer = $('<span>N/A</span>').appendTo(AN.shared('addInfo', '距離更新: '));
			var tCheck;

			function countdown(param)
			{
				if(param.time >= 0 || isWorking) {
					if(param.time >= 0) jTimer.text(param.time-- + '秒');
					return true;
				}

				$.doTimeout('checkbottom', 500, checkBottom);
			}

			var checkOnBottom = AN.util.getOptions('checkOnBottom');

			function checkBottom()
			{
				if(checkOnBottom && pages[pages.last].offset().top + pages[pages.last].height() - $d.scrollTop() - $w.height() > 500) {
					return true;
				}

				getReplies(true);
			}

			var interval = AN.util.getOptions('nCheckInterval');
			if(!interval || interval < 10) interval = 10;

			$d.bind('workstart workend', function(event)
			{
				$.doTimeout('checkbottom');
				jTimer.text('N/A');

				if(event.type == 'workend' && (displayMode !== 0 || curPageNo == lastPageNo)) {
					$.doTimeout('checkbottom', 1000, countdown, { time: event.isPageChangeEnd && (event.previouslyCached || pages.last != lastPageNo) ? 1 : interval });
				}
			});
		})();

		(function()
		{
			var jCurPageLink = $('<a />').appendTo(AN.shared('addInfo', '本頁頁數: '));
			$d.bind('workend', function(event)
			{
				if(event.isPageChangeEnd) jCurPageLink.attr('href', AN.util.getURL({ page: curPageNo })).text('第' + curPageNo + '頁');
			});
		})();

		$d.trigger({ type: 'workend', isPageChangeEnd: true });

		jDoc.defer(2, '加入讀取按扭', function(){ AN.shared('addButton', '更新帖子', function(){ getReplies(false); }); });

		if(AN.util.getOptions('addViewAjaxPageLinks')) {
			//jDoc.defer(1, '加入轉頁連結', function()
			//{
				AN.shared('addLink', '上一頁', function(){ changePage(curPageNo - 1); }, 0);
				AN.shared('addLink', '下一頁', function(){ changePage(curPageNo + 1); }, 2);
			//});
		}
	}
},

'bc2521cd-cf65-4cc5-ac9d-4fedef3c3a97':
{
	desc: 'Ajax式列表更新',
	page: { 4: true },
	type: 7,
	options:
	{
		//bAjaxifyPageChange_T: { desc: 'AJAX化轉頁', defaultValue: true, type: 'checkbox' },
		nNumOfTopicPage: { desc: '列表顯示數量', defaultValue: 1, type: 'text' },
		bAddGetBtn_T: { desc: '加入更新列表按扭', defaultValue: true, type: 'checkbox' },
		bAutoRefresh_T: { desc: '預設啟用自動更新', defaultValue: false, type: 'checkbox' },
		bAddToggleAutoBtn_T: { desc: '加入切換自動更新按扭', defaultValue: false, type: 'checkbox' },
		nRefreshInterval_T: { desc: '自動更新間隔(秒)', defaultValue: 30, type: 'text' }
	},
	once: function(jDoc)
	{
		var working = false;
		var tbodies = [];
		var apiCall = ($('#ctl00_ContentPlaceHolder1_jsLabel').html() || '').match(/PageMethods.+/m);
		var refreshTopics = function(nPage, url, continued, init)
		{
			clearTimeout(tRefresh);

			if(working && !continued) {
				return;
			}

			working = true;

			if(isNaN(nPage))
			{
				nPage = 1;
				init || AN.shared('log', '正在讀取最新列表...');
			}

			if(init && !url) {
				url = $('img[alt="next"][src="images/button-next.gif"]').parent().attr('href');
			}

			$.Deferred(function(deferred)
			{
				if(!url && apiCall) {
					var callParts = apiCall[0].split(/[()]/);
					var fn = window;

					$.each(callParts[0].split('.'), function(i, attr) {
						fn = fn[attr];
					});

					fn.apply(null, callParts[1].replace(/'/g, '').split(/,\s*/).slice(0, 2).concat(function(rows)
					{
						deferred.resolve(
							$('<tbody>')
								.append(jDoc.topicTable().find('tr:has(th):first').prevAll().addBack().clone())
								.append(rows)
							,	jDoc);
					}, $.noop));

					return;
				}

				$.getDoc(url || location.href, function(jNewDoc)
				{
					deferred.resolve(jNewDoc.topics().jTbody.find('script').remove().end()[0], jNewDoc);
				});
			}).then(function(tbody, jDoc)
			{
				tbodies.push(tbody);

				if(nPage >= AN.util.getOptions('nNumOfTopicPage'))
				{
					topicTable = $d.topicTable();
					init || topicTable.empty();
					topicTable.append(tbodies);
					AN.modFn.execMods($(document).topicTable());
					tbodies = [];
					init || AN.shared('log', '列表更新完成');

					if(bAutoRefresh)
					{
						init || AN.shared('log2', $.sprintf('%s秒後再次重新整埋....', nInterval));
						setNextRefresh();
					}

					working = false;
				}
				else
				{
					refreshTopics(++nPage, jDoc.find('img[alt="next"][src="images/button-next.gif"]').parent().attr('href'), true, init);
				}
			});
		};

		if(AN.util.getOptions('nNumOfTopicPage') > 1)
		{
			setTimeout(function(){ refreshTopics(2, null, false, true); }, 0);
		}

		var setNextRefresh = function()
		{
			tRefresh = setTimeout(function(){ refreshTopics(); }, nInterval * 1000);
		};

		if(AN.util.getOptions('bAddGetBtn_T')) jDoc.defer(2, '加入更新按扭', function(){ AN.shared('addButton', '更新列表', refreshTopics); });

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

}};
