AN.mod['Ajax Integrator'] = { ver: 'N/A', author: '向日', fn: {

'b17a0463-e46c-4420-a8f5-f169fac20aec':
{
	desc: 'Ajax化頁面讀取',
	page: { 32: true },
	type: 7,
	options:
	{
		viewAjaxDisplayMode: { desc: '顯示模式', type: 'select', choices: ['單頁模式', '延展模式', '延展模式(隱藏轉頁格)'], defaultValue: '延展模式' },
		nCheckInterval: { desc: '自動更新間隔(秒)', defaultValue: 30, type: 'text' }
		//bCheckOnBottom: { desc: '到頁底自動更新帖子', defaultValue: true, type: 'checkbox' },
		//bAddCheckBtn: { desc: '加入更新帖子按扭', defaultValue: true, type: 'checkbox' },
		//bAppendReplies: { desc: '延展帖子回覆', defaultValue: false, type: 'checkbox' },
		//bAjaxifyReplying: { desc: 'AJAX化回覆', defaultValue: true, type: 'checkbox' },
		//bShowPageNo: { desc: '顯示資料: 本頁頁數', defaultValue: true, type: 'checkbox' }
	},
	once: function(jDoc)
	{
		jDoc.defer(1, '移除原有轉頁功能', function()
		{
			window.changePage = $.blank;
		});
		
		window.ToggleUserDetail = $.blank;
		
		AN.util.stackStyle('.hkg_bottombar_link > img { border: 0; }');
		$d.bind('mousedown.userlinkbox', function(event)
		{
			var jTarget = $(event.target);
			if(!jTarget.is('a[href^="javascript: ToggleUserDetail"]')) return;
			
			event.preventDefault();
			
			var jContainer = jTarget.nextAll('div:first');
			var jUserDetails = jContainer.children('.repliers_left_user_details');
			
			if(!jUserDetails.length) {
				jContainer.append($.sprintf('\
				<div class="repliers_left_user_details"> \
					<a class="hkg_bottombar_link" href="/ProfilePage.aspx?userid=%(userid)s"><img src="/images/bb_bookmarks/profile.gif" /></a> \
					<a class="hkg_bottombar_link" href="/blog/blog.aspx?userid=%(userid)s"><img src="/images/bb_bookmarks/blog.gif" /></a> \
				</div> \
				',
				{ userid: jTarget.up('tr').attr('userid') }
				));
			}
			else {
				jUserDetails.toggle();	
			}
		});
		
		AN.util.stackStyle('.repliers { border: 0; }'); // this is for FF
		
		var pages = {};
		var curPageNo = jDoc.pageNo();
		var lastPageNo = $('select[name="page"]:first').children().length;
		var displayMode = $.inArray(AN.util.getOptions('viewAjaxDisplayMode'), this.options.viewAjaxDisplayMode.choices);
		
		function updateElements(jScope)
		{			
			$('table[width="99%"] > tbody > tr > td > strong').text(jScope.find('table[width="99%"] > tbody > tr > td > strong:first').text());
		}
		
		function handleNewPage(jScope, sNewPageNo)
		{			
			var jDiv = $('.repliers:first', jScope).up('div');
			jDiv
			.prepend(jDiv.prev())
			.children('div:eq(1)').nextAll()[jScope ? 'remove' : 'insertAfter'](jScope ? undefined : jDiv);
			
			if(displayMode != 2) {
				var jSelect = jDiv.find('select[name="page"]');
				jSelect.data('an-pageno', jSelect.val());
			}
			
			updateElements(jDiv);
			
			if(jScope) {
				AN.modFn.execMods(jDiv);
				
				for(var pageNo = 1; pageNo <= pages.last; pageNo++) {
					if(pages[pageNo] && sNewPageNo < pageNo) {
						jDiv.insertBefore(pages[pageNo]);
						break;
					}
				}
				if(pageNo > pages.last) jDiv.insertAfter(pages[pages.last]);
			}
			
			if(!pages.last || sNewPageNo && sNewPageNo > pages.last) pages.last = sNewPageNo || curPageNo;
			
			pages[sNewPageNo || curPageNo] = jDiv;
			
			return jDiv;
		}
		
		function changePage(sTargetPageNo, isAuto)
		{
			function handlePageChange(jDiv) {
				if(displayMode === 0) pages[curPageNo].hide();
				location.hash = 'page=' + sTargetPageNo;
				if(!isAuto) jDiv[0].scrollIntoView();//sTargetPageNo > curPageNo);
				curPageNo = sTargetPageNo;
				AN.shared('log', '轉頁完成');
				$d.trigger({ type: 'workend', isPageChangeEnd: true });
			}
			
			$d.trigger('workstart');
			
			AN.shared('log', $.sprintf('正在轉至第%s頁...', sTargetPageNo));
			
			if(pages[sTargetPageNo]) {
				handlePageChange(pages[sTargetPageNo].show());
			}
			else {
				$.getDoc(AN.util.getURL({ page: sTargetPageNo }), function(jNewDoc)
				{
					handlePageChange(handleNewPage(jNewDoc, sTargetPageNo));
				});
			}
		}
		
		function getReplies(isAuto)
		{
			if(pages.last == 41) {
				AN.shared('log', '1001!');
				return;
			}
			
			if(displayMode === 0 ? curPageNo != lastPageNo && !isAuto : pages.last != lastPageNo) {
				changePage((displayMode === 0 ? curPageNo : pages.last) + 1, isAuto);
				return;
			}
			
			$d.trigger('workstart');
			
			AN.shared('log', '正在讀取最新回覆...');
			
			$.getDoc(AN.util.getURL({ page: pages.last }), function(jNewDoc)
			{
				updateElements(jNewDoc);
			
				var jNewReplies = jNewDoc.find('.repliers').closest('div > table');
				var jNewSelect = jNewDoc.find('select[name="page"]:first');
				
				var oldReplyNum = pages[pages.last].find('.repliers').length;
				var newLastPageNo = jNewSelect.children().length;
				
				var difference = jNewReplies.length - oldReplyNum;
				var hasNextPage = newLastPageNo > lastPageNo;

				if(difference <= 0 && !hasNextPage) {
					AN.shared('log', '沒有新回覆');
				}
				else {
					var jNewElements = $();
					
					if(difference > 0) {
						jNewElements = jNewElements.add(jNewReplies.slice(oldReplyNum).insertAfter(pages[pages.last].children('table:last')));
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
							
							jNewElements = jNewElements.add(jNewSelect.up('div', 3).replaceAll(pages[pages.last].find('select[name="page"]').up('div', 3)));
						}
						
						if(displayMode === 0) {
							AN.shared('log', '發現下一頁, 連結建立');
						}
						else {
							changePage(pages.last + 1, isAuto);
						}
					}
					
					AN.modFn.execMods(jNewElements);
				}
				
				$d.trigger('workend');
			});
		}
		
		$('#aspnetForm').submit(function(event)
		{
			$d.trigger('workstart');
			
			event.preventDefault();
			AN.shared('log', '正在發送回覆...');
			$.post(location.pathname + location.search, $('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24btn_Submit.x=0&ctl00%24ContentPlaceHolder1%24btn_Submit.y=0', function(sHTML)
			{
				if($.doc(sHTML).pageName() != 'view') return AN.shared('log', '回覆發送失敗!');

				$('#ctl00_ContentPlaceHolder1_messagetext').val('');
				$('#previewArea').empty();
				AN.shared('log', '回覆發送完成');
				
				getReplies(true);
			});
		});
		
		var isWorking = false;
		
		$d.bind('workstart workend', function(event){ isWorking = (event.type == 'workstart'); });
		
		$d.bind('click', function(event)
		{
			if(!(!isWorking && event.button === 0)) return;
			
			var jTarget = $(event.target);
			if(jTarget.parent('a').length) jTarget = jTarget.parent();
			if(!(jTarget.is('a') && $('select[name="page"]').parent().parent().has(jTarget[0]).length)) return;
			
			event.preventDefault();
			changePage(AN.util.getPageNo(jTarget.attr('href')));
		});
		
		if(displayMode == 2) {
			AN.util.stackStyle($.sprintf('%(pageDiv)s > div, %(pageDiv)s > br, %(pageDiv)s + br { display: none; }', { pageDiv: '#ctl00_ContentPlaceHolder1_view_form > div[style*="100%"]' }));
		}
		else {
			$d.bind('change', function(event)
			{
				if(isWorking) return;
				
				var jTarget = $(event.target);
				if(!jTarget.is('select[name="page"]')) return;
				
				var target = jTarget.val();
				jTarget.val(jTarget.data('an-pageno'));
				changePage(target);
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
			
			function checkBottom()
			{
				if(pages[pages.last].offset().top + pages[pages.last].height() - $d.scrollTop() - $w.height() > 500) {
					return true;
				}
				
				getReplies(true);
			}
			
			var interval = AN.util.getOptions('nCheckInterval');
			if(!interval || interval < 30) interval = 30;
			
			$d.bind('workstart workend', function(event)
			{
				$.doTimeout('checkbottom');
				jTimer.text('N/A');
				
				if(event.type == 'workend' && (displayMode !== 0 || curPageNo == lastPageNo)) {
					$.doTimeout('checkbottom', 1000, countdown, { time: event.isPageChangeEnd && pages.last != lastPageNo ? 3 : interval });
				}
			});
			
			$d.trigger({ type: 'workend', isPageChangeEnd: true });
		})();
		
		jDoc.defer(2, '加入讀取按扭', function(){ AN.shared('addButton', '更新帖子', function(){ if(!isWorking) getReplies(); }); });
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
		var refreshTopics = function(nPage)
		{
			clearTimeout(tRefresh);

			if(isNaN(nPage) || nPage < 1)
			{
				nPage = 1;
				AN.shared('log', '正在讀取最新列表...');
			}

			$.getDoc(AN.util.getURL({ page: nPage }), function(jNewDoc)
			{
				var jNewTbody = jNewDoc.topics().jTbody;
				var jTopicTable = $d.topicTable();

				if(nPage == 1) jTopicTable.empty();
				jTopicTable.append(jNewTbody);

				if(nPage == AN.util.getOptions('nNumOfTopicPage'))
				{
					AN.modFn.execMods($(document).topicTable());
					AN.shared('log', '列表更新完成');

					if(bAutoRefresh)
					{
						AN.shared('log2', $.sprintf('%s秒後再次重新整埋....', nInterval));
						setNextRefresh();
					}
				}
				else
				{
					refreshTopics(nPage + 1);
				}
			});
		};

		if(AN.util.getOptions('nNumOfTopicPage') > 1)
		{
			setTimeout(function(){ refreshTopics(2); }, 0);
		}

		var setNextRefresh = function()
		{
			tRefresh = setTimeout(refreshTopics, nInterval * 1000);
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