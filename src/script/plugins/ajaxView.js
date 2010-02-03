$.extend(an.plugins, {

'b17a0463-e46c-4420-a8f5-f169fac20aec':
{
	desc: 'Ajax化頁面讀取',
	page: { 32: on },
	type: 7,
	options:
	{
		viewAjaxDisplayMode: { desc: '顯示模式', type: 'select', choices: ['單頁模式', '延展模式', '延展模式(隱藏轉頁格)'], defaultValue: '延展模式' },
		nCheckInterval: { desc: '自動更新間隔(秒)', defaultValue: 30, type: 'text' },
		addViewAjaxPageLinks: { desc: '加入轉頁連結至連結元件', defaultValue: true, type: 'checkbox' }
	},
	queue: [{
		fn: function(job)
		{
			$.prioritize(5, 1, function()
			{
				window.changePage = $.noop;
			});

			window.ToggleUserDetail = $.noop;

			$.ss('.hkg_bottombar_link > img { border: 0; }');
			$d.bind('mousedown.userlinkbox', function(event)
			{
				var jTarget = $(event.target);
				if(!jTarget.is('a[href^="javascript: ToggleUserDetail"]')) return;

				event.preventDefault();

				var jContainer = jTarget.nextAll('div:first');
				var jUserDetails = jContainer.children('.repliers_left_user_details');

				if(!jUserDetails.length) {
					jContainer.append($.format('\
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

			var pages = {};
			var curPageNo = $.pageNo();
			var lastPageNo = $('select[name="page"]:first').children().length;
			var displayMode = $.inArray(job.options('viewAjaxDisplayMode'), job.plugin.options.viewAjaxDisplayMode.choices);

			function updateElements(jScope)
			{
				$('table[width="99%"] > tbody > tr > td > strong').text(jScope.find('table[width="99%"] > tbody > tr > td > strong:first').text());
			}

			function handleNewPage(jScope, newPageNo)
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
					for(var pageNo = 1; pageNo <= pages.last; pageNo++) {
						if(pages[pageNo] && newPageNo < pageNo) {
							jDiv.insertBefore(pages[pageNo]);
							break;
						}
					}
					if(pageNo > pages.last) jDiv.insertAfter(pages[pages.last]);

					jDiv.an();
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
					location.hash = 'page=' + targetPageNo;
					if(!isAuto) jDiv[0].scrollIntoView();//targetPageNo > curPageNo);
					curPageNo = targetPageNo;
					$.run('log', '轉頁完成');
					$d.trigger({ type: 'workend', isPageChangeEnd: true, previouslyCached: previouslyCached });
				}

				$d.trigger('workstart');

				$.run('log', '正在轉至第{0}頁...', targetPageNo);

				if(previouslyCached) {
					handlePageChange(pages[targetPageNo].show());
				}
				else {
					$.getDoc($.search({ page: targetPageNo }), function(jNewDoc)
					{
						handlePageChange(handleNewPage(jNewDoc, targetPageNo));
					});
				}
			}

			function getReplies(isAuto)
			{
				if(isWorking) return;

				if(pages.last == 41) {
					$.run('log', '1001!');
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

				$.run('log', '正在讀取最新回覆...');

				$.getDoc($.search({ page: pages.last }), function(jNewDoc)
				{
					updateElements(jNewDoc);

					var jNewReplies = jNewDoc.find('.repliers').closest('div > table');
					var jNewSelect = jNewDoc.find('select[name="page"]:first');

					var oldReplyNum = pages[pages.last].find('.repliers').length;
					var newLastPageNo = jNewSelect.children().length;

					var difference = jNewReplies.length - oldReplyNum;
					var hasNextPage = newLastPageNo > lastPageNo;

					if(difference <= 0 && !hasNextPage) {
						$.run('log', '沒有新回覆');
					}
					else {
						var jNewElements = $();

						if(difference > 0) {
							jNewElements = jNewElements.add(jNewReplies.slice(oldReplyNum).insertAfter(pages[pages.last].children('table:last')));
							$.run('log', '加入{0}個新回覆', difference);
						}

						if(hasNextPage) {
							lastPageNo = newLastPageNo;

							if(displayMode != 2) {
								$('select[name="page"]').each(function()
								{
									var jThis = $(this);
									var max = jThis.children().length;
									while(max < newLastPageNo) {
										jThis.append($.format('<option value="{0}">{0}</option>', ++max));
									}
								});

								jNewElements = jNewElements.add(jNewSelect.up('div', 3).replaceAll(pages[pages.last].find('select[name="page"]').up('div', 3)));
							}

							if(displayMode === 0) {
								$.run('log', '發現下一頁, 連結建立');
							}
							else {
								changePage(pages.last + 1, isAuto);
							}
						}

						jNewElements.an();
					}

					$d.trigger('workend');
				});
			}

			$('#aspnetForm').submit(function(event)
			{
				event.preventDefault();

				if(isWorking) {
					AN.shared('log', '正在工作中, 完成將自動重試');
					$d.one('workend', function()
					{
						$('#aspnetForm').submit();
					});
					return;
				}

				$d.trigger('workstart');

				$.run('log', '正在發送回覆...');
				$.post(location.pathname + location.search, $('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24btn_Submit.x=0&ctl00%24ContentPlaceHolder1%24btn_Submit.y=0', function(sHTML)
				{
					if($.doc(sHTML).pageName() != 'view') {
						$.run('log', '回覆發送失敗!');
						return $d.trigger('workend');
					}

					$('#ctl00_ContentPlaceHolder1_messagetext').val('');
					$('#previewArea').empty();
					$.run('log', '回覆發送完成');

					$d.trigger('workend');

					getReplies(true);
				});
			});

			var isWorking = false;

			$d.bind('workstart workend', function(event){ isWorking = (event.type == 'workstart'); });

			$d.bind('click', function(event)
			{
				var jTarget = $(event.target);
				if(jTarget.parent('a').length) jTarget = jTarget.parent();
				if(!(jTarget.is('a') && jTarget.parent('div').siblings('div').children('select[name="page"]').length)) return;

				event.preventDefault();
				changePage(jTarget.pageNo());
			});

			if(displayMode == 2) {
				$.ss('{0} > div, {0} > br, {0} + br { display: none; }', '#ctl00_ContentPlaceHolder1_view_form > div[style*="100%"]' );
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
				var jTimer = $('<span>N/A</span>').appendTo($.run('addInfo', '距離更新: '));
				var tCheck;

				function countdown(time)
				{
					if(time >= 0 || isWorking) {
						if(time >= 0) jTimer.text(time-- + '秒');
						$.timeout('checkbottom', 1000, countdown, time);
					}
					else {
						$.timeout('checkbottom', 500, checkBottom);
					}
				}

				function checkBottom()
				{
					if(pages[pages.last].offset().top + pages[pages.last].height() - $d.scrollTop() - $(window).height() > 500) {
						$.timeout('checkbottom');
					}
					else {
						getReplies(true);
					}
				}

				var interval = job.options('nCheckInterval');
				if(!interval || interval < 10) interval = 10;

				$d.bind('workstart workend', function(event)
				{
					$.timeout('checkbottom', null);
					jTimer.text('N/A');

					if(event.type == 'workend' && (displayMode !== 0 || curPageNo == lastPageNo)) {
						$.timeout('checkbottom', 1000, countdown, event.isPageChangeEnd && (event.previouslyCached || pages.last != lastPageNo) ? 1 : interval);
					}
				});
			})();

			(function()
			{
				var jCurPageLink = $('<a />').appendTo($.run('addInfo', '本頁頁數: '));
				$d.bind('workend', function(event)
				{
					if(event.isPageChangeEnd) jCurPageLink.attr('href', $.search({ page: curPageNo })).text('第' + curPageNo + '頁');
				});
			})();

			$d.trigger({ type: 'workend', isPageChangeEnd: true });

			$.run('addButton', '更新帖子', function(){ getReplies(false); });

			if(job.options('addViewAjaxPageLinks')) {
				$.run('addLink', '上一頁', function(){ changePage(curPageNo - 1); }, 0);
				$.run('addLink', '下一頁', function(){ changePage(curPageNo + 1); }, 2);
			}
		}
	}]
}

});