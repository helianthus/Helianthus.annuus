AN.mod['Ajax Integrator'] = { ver: 'N/A', author: '向日', fn: {

'b17a0463-e46c-4420-a8f5-f169fac20aec':
{
	desc: 'Ajax化頁面讀取',
	page: { 32: true },
	type: 7,
	options:
	{
		//bCheckOnBottom: { desc: '到頁底自動更新帖子', defaultValue: true, type: 'checkbox' },
		//nCheckInterval: { desc: '自動更新間隔(秒)', defaultValue: 30, type: 'text' },
		//bAddCheckBtn: { desc: '加入更新帖子按扭', defaultValue: true, type: 'checkbox' },
		//bAppendReplies: { desc: '延展帖子回覆', defaultValue: false, type: 'checkbox' },
		bRemovePageBoxes: { desc: '隱藏轉頁格', defauleValue: false, type: 'checkbox' }
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
		
		var cache = {};
		var curPageNo = jDoc.pageNo();
		var lastPageNo;
		
		function updateElements(jScope)
		{
			var last = $('select[name="page"]:first', jScope).children().length;
			
			if(!jScope) {
				lastPageNo = last;
				return;
			}
			
			if(last != lastPageNo) {
				lastPageNo = last;
				
				$('select[name="page"]').each(function()
				{
					var jThis = $(this);
					var max = jThis.children().length;
					while(max < last) {
						jThis.append($.sprintf('<option value="%(pageNo)s">%(pageNo)s</option>', { pageNo: ++max }));
					}
				});
			}
			
			$('#ctl00_ContentPlaceHolder1_view_form > div[style*="100%"] td > strong').text(jScope.find('strong:first').text());
		}
		
		function handleNewPage(jScope, sNewPageNo)
		{			
			var jDiv = $('.repliers:first', jScope).up('div');
			jDiv
			.prepend(jDiv.prev())
			.children('div:eq(1)').nextAll()[jScope ? 'remove' : 'insertAfter'](jScope ? undefined : jDiv);
			
			var jSelect = jDiv.find('select[name="page"]');
			jSelect.data('an-pageno', jSelect.val());
			
			updateElements(jDiv);
			
			if(jScope) {
				AN.modFn.execMods(jDiv);
				
				for(var pageNo = 1; pageNo <= cache.last; pageNo++) {
					if(cache[pageNo] && sNewPageNo < pageNo) {
						jDiv.insertBefore(cache[pageNo]);
						break;
					}
				}
				if(pageNo > cache.last) jDiv.insertAfter(cache[cache.last]);
			}
			
			if(!cache.last || sNewPageNo && sNewPageNo > cache.last) cache.last = sNewPageNo || curPageNo;
			
			cache[sNewPageNo || curPageNo] = jDiv;
			
			return jDiv;
		}
		
		function changePage(sTargetPageNo, isAuto)
		{
			function handlePageChange(jDiv) {
				location.hash = 'page=' + sTargetPageNo;
				if(!isAuto) jDiv[0].scrollIntoView();//sTargetPageNo > curPageNo);
				curPageNo = sTargetPageNo;
				AN.shared('log', '轉頁完成');
				$d.trigger({ type: 'workend', isPageChangeEnd: true });
			}
			
			$d.trigger('workstart');
			
			AN.shared('log', $.sprintf('正在轉至第%s頁...', sTargetPageNo));
			
			if(cache[sTargetPageNo]) {
				handlePageChange(cache[sTargetPageNo]);
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
			if(cache.last == 41) {
				AN.shared('log', '1001!');
				return;
			}
			
			if(cache[cache.last].find('select[name="page"]:first').children().length < lastPageNo) {
				changePage(cache.last + 1, isAuto);
				return;
			}
			
			$d.trigger('workstart');
			
			AN.shared('log', '正在讀取最新回覆...');
			
			$.getDoc(AN.util.getURL({ page: cache.last }), function(jNewDoc)
			{
				updateElements(jNewDoc);
				
				var jNewReplies = jNewDoc.find('.repliers').closest('div > table');
				var jNewSelect = jNewDoc.find('select[name="page"]:first');
				
				var oldLength = cache[cache.last].find('.repliers').length;
				var difference = jNewReplies.length - oldLength;
				var hasNextPage = jNewSelect.children().length > cache.last;

				if(difference <= 0 && !hasNextPage) {
					AN.shared('log', '沒有新回覆');
				}
				else {
					var jNewElements = $();
					
					if(difference > 0) {
						jNewElements = jNewElements.add(jNewReplies.slice(oldLength).insertAfter(cache[cache.last].children('table:last')));
						AN.shared('log', $.sprintf('加入%s個新回覆', difference));
					}

					if(hasNextPage) {
						jNewElements = jNewElements.add(jNewSelect.up('div', 3).replaceAll(cache[cache.last].find('select[name="page"]').up('div', 3)));
						//AN.shared('log', '發現下一頁, 連結建立');
						changePage(cache.last + 1, isAuto);
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
				
				getReplies();
			});
		});
		
		var isWorking = false;
		
		$d
		.bind('workstart workend', function(event){ isWorking = (event.type == 'workstart'); })
		.bind('click', function(event)
		{
			if(!(!isWorking && event.button === 0)) return;
			
			var jTarget = $(event.target);
			if(jTarget.parent('a').length) jTarget = jTarget.parent();
			if(!(jTarget.is('a') && $('select[name="page"]').parent().parent().has(jTarget[0]).length)) return;
			
			event.preventDefault();
			changePage(AN.util.getPageNo(jTarget.attr('href')));
		})
		.bind('change', function(event)
		{
			if(isWorking) return;
			
			var jTarget = $(event.target);
			if(!jTarget.is('select[name="page"]')) return;
			
			var target = jTarget.val();
			jTarget.val(jTarget.data('an-pageno'));
			changePage(target);
		});
		
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
				if(cache[cache.last].offset().top + cache[cache.last].height() - $d.scrollTop() - $w.height() > 500) {
					return true;
				}
				
				getReplies(true);
			}
			
			$d.bind('workstart workend', function(event)
			{
				$.doTimeout('checkbottom');
				jTimer.text('N/A');
				
				if(event.type == 'workend') $.doTimeout('checkbottom', 1000, countdown, { time: event.isPageChangeEnd && cache.last != lastPageNo ? 3 : 30 });
			});
			
			$.doTimeout('checkbottom', 1000, countdown, { time: cache.last != lastPageNo ? 3 : 30 });
		})();
		
		jDoc.defer(2, '加入讀取按扭', function(){ AN.shared('addButton', '更新帖子', function(){ if(!isWorking) getReplies(); }); });
		
		if(AN.util.getOptions('bRemovePageBoxes'))
			AN.util.stackStyle($.sprintf('%(pageDiv)s > div, %(pageDiv)s > br, %(pageDiv)s + br { display: none; }', { pageDiv: '#ctl00_ContentPlaceHolder1_view_form > div[style*="100%"]' }));
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