AN.mod['Main Script'] = { ver: 'N/A', author: '向日', fn: {

// 佈局設定 //
'63d2407a-d8db-44cb-8666-64e5b76378a2':
{
	desc: '隱藏廣告',
	page: { 65535: true },
	type: 3,
	//options: { 'bRetroHideAds': { desc: '相容性模式', defaultValue: false, type: 'checkbox' } },
	once: function()
	{
		$.each(
		{
			65535: '\
			#HKGTopAd { display: none; } \
			',
			// topics
			4: '\
			.ContentPanel > table { width: 100%; } \
			.ContentPanel > table > tbody > tr > td:first-child { width: auto !important; } \
			.ContentPanel > table > tbody > tr > td:first-child + td { display: none; } \
			.PageMiddleBox > table > tbody > tr > td:first-child { width: 100% !important; } \
			.PageMiddleBox > table > tbody > tr > td:first-child + td { display: none; } \
			',
			// search, tags
			24: '\
			#ctl00_ContentPlaceHolder1_topics_form > script:first-child + div { width: 100% !important; } \
			#ctl00_ContentPlaceHolder1_topics_form > script:first-child + div + div { display: none; } \
				{ display: none; } \
			',
			// view
			32: $.sprintf('\
			#ctl00_ContentPlaceHolder1_view_form > script:first-child + div { width: 100% !important; } \
			#ctl00_ContentPlaceHolder1_view_form > script:first-child + div + div { display: none; } \
			#ctl00_ContentPlaceHolder1_view_form div > div[style*="%s"] { border-bottom: 0 !important; } \
			#ctl00_ContentPlaceHolder1_view_form div > div[style*="58px"], /* top & bottom ads */\
			#ctl00_ContentPlaceHolder1_view_form > div > table[width="100%"] > tbody > tr + tr /* inline ads */\
				{ display: none; } \
			',
			$.browser.msie ? 'PADDING-BOTTOM: 18px' : 'padding: 18px'
			)
			,
			// topics, search, tags, view
			60: '\
			#GenMainPageAd1, #MiddlePageAd1, #MainPageAd2, #MainPageAd2 ~ br, #ctl00_ContentPlaceHolder1_lb_NewPM + br, #ctl00_ContentPlaceHolder1_MiddleAdSpace1 div[style*="right"] { display: none; } \
			',
			// profilepage
			64: '\
			/* inline ads */\
			.main_table1 tr { display: none; } \
			.main_table1 tr[style], .main_table1 tr:first-child, #ctl00_ContentPlaceHolder1_ProfileForm > table > tbody > tr > td > table:first-child .main_table1 tr { display: table-row; } \
			'
		},
		function(nPageCode){ $d.pageCode() & nPageCode && AN.util.stackStyle(this); });

		if(true)//AN.util.getOptions('bRetroHideAds'))
		{
			AN.util.stackStyle('td[height="52"] { display: none; }');
		}
		else if($d.pageCode() & 28)
		{
			if($.browser.msie)
			{
				AN.util.stackStyle($.sprintf(
				$d.pageName() == 'topics'
				?
				'\
				#HotTopics tr:first-child+tr%(extra)s, \
				#HotTopics tr:first-child+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr%(extra)s, \
				#HotTopics tr:first-child+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr%(extra)s, \
				#HotTopics tr:first-child+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr%(extra)s \
					{ display: none; } \
				'
				:
				'\
				#ctl00_ContentPlaceHolder1_topics_form > div + table + table tr:first-child+tr%(extra)s, \
				#ctl00_ContentPlaceHolder1_topics_form > div + table + table tr:first-child+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr%(extra)s, \
				#ctl00_ContentPlaceHolder1_topics_form > div + table + table tr:first-child+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr%(extra)s, \
				#ctl00_ContentPlaceHolder1_topics_form > div + table + table tr:first-child+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr+tr%(extra)s, \
				td[height="52"] \
					{ display: none; } \
				'
				,
				{ extra: $('#aspnetForm[action*="type=MB"]').length ? '+tr' : '' }
				));
			}
			else
			{
				AN.util.stackStyle($.sprintf(
				$d.pageName() == 'topics'
				?
				'\
				#HotTopics tr:nth-child(11n+%(num)s) \
					{ display: none; } \
				'
				:
				'\
				#ctl00_ContentPlaceHolder1_topics_form > div + table + table tr:nth-child(11n+%(num)s), \
				#ctl00_ContentPlaceHolder1_topics_form > div + table + table table tr:last-child \
					{ display: none; } \
				'
				,
				{ num: $('#aspnetForm[action*="type=MB"]').length ? 3 : 2 }
				));
			}
		}
	},
	infinite: function()
	{
		if($.browser.msie && $d.pageCode() == 32) $('div[style*="PADDING-BOTTOM: 18px"]').css('border-bottom', 0); // yet another IE8 bug!?

		if(true)//AN.util.getOptions('bRetroHideAds'))
		{
			$('td[height="52"]').parent().hide();
		}
	}
},

// 修正修改 //
'b7ef89eb-1190-4466-899a-c19b3621d6b1':
{
	desc: 'Opera: 修正無法使用Enter搜尋的錯誤',
	page: { 30: $.browser.opera || 'disabled' },
	type: 4,
	once: function()
	{
		$('#aspnetForm').submit(function(event)
		{
			event.preventDefault();
		});
	}
},

'd4bf67cc-349c-4541-a8e4-9d9f9d0be267':
{
	desc: 'Opera: 修正特殊字符導致的顯示錯誤',
	page: { 92: $.browser.opera || 'disabled' },
	type: 4,
	infinite: function(jDoc)
	{
		jDoc.topics().jNameLinks.each(function()
		{
			var jNameCell = $(this).parent();
			if(jNameCell.nextAll().length != 2)
			{
				jNameCell[0].outerHTML = jNameCell[0].outerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<A.+?\/a>/, 'NAME_ERROR').replace(/=""/g, '');
			}
		});
	}
},

'0293c9da-468f-4ed5-a2d7-ecb0067e713f':
{
	desc: '去除引用半透明',
	page: { 32: !$.browser.msie || 'disabled' },
	type: 4,
	once: function()
	{
		AN.util.stackStyle('blockquote { opacity: 1; }');
	}
},

'd563af32-bd37-4c67-8bd7-0721c0ab0b36':
{
	desc: '優化頁數跳轉連結地址',
	page: { 32: true },
	type: 4,
	once: function()
	{
		window.changePage = function(nPageNo)
		{
			var sPage = (nPageNo) ? ('&page=' + nPageNo) : '';
			var sHighlight = (window.highlight_id) ? ('&highlight_id=' + window.highlight_id) : '';
			location.assign($.sprintf('/view.aspx?message=%s%s%s', window.messageid, sPage, sHighlight));
		};

		var regex = /&(?:page=1(?!\d)|highlight_id=0)/g;
		$d.mouseover(function(event)
		{
			var jTarget = $(event.target);
			if(!(jTarget.is('a') && regex.test(jTarget.attr('href')))) return;

			jTarget.attr('href', jTarget.attr('href').replace(regex, ''));
		});
	}
},

'b6b232c8-1f26-449e-bb0d-2b7826bf95ef':
{
	desc: '去除論壇原有的圖片縮小功能',
	page: { 32: true, 192: true },
	type: 4,
	once: function()
	{
		window.DrawImage = $.noop;

		AN.util.stackStyle('\
		.repliers_right a[target] { display: inline-block; max-width: 100% } \
		.repliers_right img[onload] { width: auto; height: auto; max-width: 100% } \
		.repliers_right > tbody > tr:first-child a[target]:focus { outline: 0; } \
		');
	}
},

'd7adafa8-cc14-45f9-b3e9-bc36eab05d4f':
{
	desc: '縮小引用中的圖片',
	page: { 32: false },
	type: 4,
	options: { nQuoteImgMaxHeight: { desc: '圖片最大高度(px)', defaultValue: 100, type: 'text' } },
	once: function()
	{
		AN.util.stackStyle($.sprintf('.repliers_right blockquote img[onload] { width: auto; height: auto; max-height: %spx; }', AN.util.getOptions('nQuoteImgMaxHeight')));
	}
},

'52ebe3d3-bf98-44d2-a101-180ec69ce290':
{
	desc: '移除帖子連結高亮部份',
	page: { 64: false },
	type: 4,
	once: function()
	{
		var regex = /&highlight_id=\d+/;
		$d.mouseover(function(event)
		{
			var jTarget = $(event.target);
			if(!(jTarget.is('a') && regex.test(jTarget.attr('href')))) return;

			jTarget.attr('href', jTarget.attr('href').replace(regex, ''));
		});
	}
},

'87a6307e-f5c2-405c-8614-af60c85b101e':
{
	desc: '搜尋開新頁',
	page: { 4: false, 24: false },
	type: 4,
	once: function()
	{
		window.Search = function()
		{
			var sType = $('#st').val();
			var sQuery = escape($('#searchstring').val());

			window.open(sType == 'tag' ? 'tags.aspx?tagword='.concat(sQuery) : $.sprintf('search.aspx?st=%s&searchstring=%s', sType, sQuery), '_blank');

			$('#searchstring').val('');
		};
	}
},

'a93f1149-d11b-4b72-98dd-c461fd9ee754':
{
	desc: '連結開新頁',
	page: { 4: false, 24: false, 64: false },
	type: 4,
	options: { bTopicLinksOnly: { desc: '只限帖子連結', defaultValue: false, type: 'checkbox' } },
	once: function()
	{
		$d.click(function(event)
		{
			var jTarget = $(event.target);
			if(jTarget.parent('a').length) jTarget = jTarget.parent();
			if(!jTarget.is('a') || !(AN.util.getOptions('bTopicLinksOnly') ? /view\.aspx/i : /^(?!javascript|#)/).test(jTarget.attr('href'))) return;

			event.preventDefault();
			window.open(jTarget.attr('href'));
		});
	}
},

'2ab2f404-0d35-466f-98a5-c88fdbdaa031':
{
	desc: '外鏈連結開新頁',
	defer: 3,
	page: { 32: true },
	type: 4,
	once: function()
	{
		$d.click(function(event)
		{
			var jTarget = $(event.target);
			if(jTarget.parent('a').length) jTarget = jTarget.parent();
			if(!jTarget.is('.repliers_right > tbody > tr:first-child a') || /^(?:javascript|#)/.test(jTarget.attr('href'))) return;

			if(event.isDefaultPrevented()) return;

			event.preventDefault();
			window.open(jTarget.attr('href'));
		});
	}
},

'b73d2968-8301-4c5e-8700-a89541d274fc':
{
	desc: '回復傳統用戶連結',
	defer: 1,
	page: { 32: false },
	type: 4,
	once: function()
	{
		$d
		.unbind('.userlinkbox')
		.bind('mouseover', function(event)
		{
			var jTarget = $(event.target);
			if(!jTarget.is('a[href^="javascript: ToggleUserDetail"]')) return;

			jTarget.attr('href', $.sprintf('ProfilePage.aspx?userid=%s', jTarget.up('tr').attr('userid')));
		});
	}
},

'7f9780a6-395d-4b24-a0a8-dc58c4539408':
{
	desc: '修正字型大小/顏色插入控件',
	page: { 416: true },
	type: 4,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_messagetext').siblings('select[onchange]').change(function()
		{
			this.selectedIndex = 0;
		});
	}
},

'6e978310-e87b-4043-9def-076a13377c19':
{
	desc: '更換favicon(小丑icon) [部份瀏覽器無效]',
	page: { 65534: false },
	type: 4,
	once: function()
	{
		$('head').append('<link rel="shortcut icon" href="http://helianthus-annuus.googlecode.com/svn/other/hkg.ico" />');
	}
},


'e54d5c5f-47ae-4839-b4e8-6fc3733edfef':
{
	desc: '改進公司模式',
	page: { 65534: true },
	type: 4,
	options:
	{
		sCModeFavicon: { desc: 'favicon連結位置', defaultValue: 'http://www.google.com/favicon.ico', type: 'text' },
		sCModeTitle: { desc: '標題名稱', defaultValue: 'Google', type: 'text' }
	},
	once: function()
	{
		if(AN.util.cookie('crossover_companymode') == 'Y')
		{
			$('head').append($.sprintf('<link rel="shortcut icon" href="%s" />', AN.util.getOptions('sCModeFavicon')));
			document.title = AN.util.getOptions('sCModeTitle');
		}
	}
},

'4fd8aa4c-5a8f-405f-aecd-d535b0e99aec':
{
	desc: '強制停用懷舊模式',
	page: { 65534: true },
	type: 4,
	once: function()
	{
		AN.util.cookie('crossover_sensormode', 'N');
	}
},

// 加入物件 //
'231825ad-aada-4f5f-8adc-5c2762c1b0e5':
{
	desc: '顯示資料: 樓主名稱',
	page: { 32: false },
	type: 5,
	once: function(jDoc)
	{
		AN.util.getOpenerInfo(jDoc, function(oInfo)
		{
			AN.shared('addInfo', $.sprintf('樓主: <a target="_blank" href="/ProfilePage.aspx?userid=%s">%s</a>', oInfo.sId, oInfo.sName));
		});
	}
},

'9e181e79-153b-44d5-a482-5ccc6496a172':
{
	desc: '顯示資料: 累計在線時間',
	page: { 65534: false },
	type: 5,
	once: function()
	{
		var nLastOnTime = AN.util.data('nLastOnTime');
		var nCumulatedTime = AN.util.data('nCumulatedTime') || 0;

		if(nLastOnTime)
		{
			var nDifference = $.time() - nLastOnTime;
			nCumulatedTime += (nDifference >= 120000) ? 120000 : nDifference;
		}

		var sCumulated;
		if(nCumulatedTime > 86400000)
		{
			sCumulated = (nCumulatedTime / 86400000).toFixed(2) + ' days';
		}
		else if(nCumulatedTime > 3600000)
		{
			sCumulated = (nCumulatedTime / 3600000).toFixed(2) + ' hours';
		}
		else
		{
			sCumulated = (nCumulatedTime / 60000).toFixed(2) + ' minutes';
		}

		AN.shared('addInfo', $.sprintf('在線時間: %s', sCumulated));

		AN.util.data('nLastOnTime', $.time());
		AN.util.data('nCumulatedTime', nCumulatedTime);
	}
},

'f47e77c8-6f1a-43b2-8493-f43de222b3b4':
{
	desc: '加入伺服器狀態顯示按扭',
	page: { 65534: true },
	type: 5,
	once: function()
	{
		AN.shared('addButton', '伺服器狀態', AN.shared.serverTable);
	}
},

'7de28ca9-9c44-4949-ad4a-31f38a984715':
{
	desc: '加入一鍵留名按扭',
	page: { 32: false },
	type: 5,
	options: { sLeaveNameMsg: { desc: '回覆內容', defaultValue: '留名', type: 'text' } },
	once: function()
	{
		if(!AN.util.isLoggedIn()) return;

		AN.shared('addButton', '一鍵留名', function()
		{
			$('#ctl00_ContentPlaceHolder1_messagetext').val(AN.util.getOptions('sLeaveNameMsg'));
			$('#aspnetForm').submit();
		});
	}
},

'aad1f3ac-e70c-4878-a1ef-678539ca7ee4':
{
	desc: '加入前往吹水台的快速連結',
	page: { 65534: true },
	type: 5,
	once: function()
	{
		AN.shared('addLink', '吹水台', '/topics.aspx?type=BW', 1);
	}
},

'd0d76204-4033-4bd6-a9a8-3afbb807495f':
{
	desc: '加入前往最頂/底的按扭',
	page: { 32: true },
	type: 5,
	once: function()
	{
		AN.shared('addLink', '最頂', function(){ document.body.scrollIntoView(); }, 0);
		AN.shared('addLink', '最底', function(){ document.body.scrollIntoView(false); }, 2);
	}
},

'b78810a2-9022-43fb-9a9b-f776100dc1df':
{
	desc: '加入樓層編號',
	page: { 32: true },
	type: 5,
	infinite: function(jDoc)
	{
		var nCurPageNo = jDoc.pageNo();
		var nFloor = ((nCurPageNo == 1) ? 0 : 25 * (nCurPageNo - 1) + 1) + jDoc.pageScope().find('.an-content-floor').length;

		jDoc.replies().each(function()
		{
			$(this).find('span:last').append($.sprintf(' <span class="an-content-floor an-content-box">#%s</span>', nFloor++));
		});
	}
},

// 其他功能 //
'3f693a9e-e79d-4d14-b639-a57bee36079a':
{
	desc: '自動顯示伺服器狀態檢查視窗',
	page: { 1: true },
	type: 6,
	defer: 5,
	once: function()
	{
		AN.shared('serverTable');
	}
},

'4cdce143-74a5-4bdb-abca-0351638816fa':
{
	desc: '發表新帖子的主旨過長時進行提示',
	page: { 256: true },
	type: 6,
	once: function(jDoc)
	{
		if(location.search.indexOf('mt=N') != -1)
		{
			$('#aspnetForm').submit(function()
			{
				var sTitle = $('#ctl00_ContentPlaceHolder1_messagesubject').val();
				var n = 0;
				for(var i=0; i<sTitle.length; i++)
				{
					n += sTitle.charCodeAt(i) > 255 ? 2 : 1;
				}
				if(n > 50 && !confirm('主旨過長!(位元組 > 50)\n將導致帖子發表失敗或主旨被裁剪!\n\n確定要進行發表?'))
				{
					return false;
				}
			});
		}
	}
},

'86d24fc8-476a-4de3-95e1-5e0eb02b3353':
{
	desc: '轉換表情碼為圖片',
	page: { 92: true },
	type: 6,
	infinite: function(jDoc)
	{
		var rSmiley = /[#[](hehe|love|ass|sosad|good|hoho|kill|bye|adore|banghead|bouncer|bouncy|censored|flowerface|shocking|photo|fire|yipes|369|bomb|slick|no|kill2|offtopic)[\]#]/g;

		var aConvertMap =
		[
			{ regex: /O:-\)/g, result: 'angel' },
			{ regex: /xx\(/g, result: 'dead' },
			{ regex: /:\)/g, result: 'smile' },
			{ regex: /:o\)/g, result: 'clown' },
			{ regex: /:-\(/g, result: 'frown' },
			{ regex: /:~\(/g, result: 'cry' },
			{ regex: /;-\)/g, result: 'wink' },
			{ regex: /:-\[/g, result: 'angry' },
			{ regex: /:-]/g, result: 'devil' },
			{ regex: /:D/g, result: 'biggrin' },
			{ regex: /:O/g, result: 'oh' },
			{ regex: /:P/g, result: 'tongue' },
			{ regex: /^3^/g, result: 'kiss' },
			{ regex: /\?_\?/g, result: 'wonder' },
			{ regex: /#yup#/g, result: 'agree' },
			{ regex: /#ng#/g, result: 'donno' },
			{ regex: /#oh#/g, result: 'surprise' },
			{ regex: /#cn#/g, result: 'chicken' },
			{ regex: /Z_Z/g, result: 'z' },
			{ regex: /@_@/g, result: '@' },
			{ regex: /\?\?\?/g, result: 'wonder2' },
			{ regex: /fuck/g, result: 'fuck' }
		];

		jDoc.topics().jTitleCells.find('a:first-child').each(function()
		{
			var jThis = $(this);
			var sOri = sText = jThis.html();

			sText = sText.replace(rSmiley, '<img style="border-width:0px" src="/faces/$1.gif" alt="$&" />');

			$.each(aConvertMap, function()
			{
				sText = sText.replace(this.regex, '<img style="border-width:0px" src="/faces/' + this.result + '.gif" alt="$&" />');
			});

			if(sText != sOri) jThis.html(sText);
		});
	}
},

'b69c5067-2726-43f8-b3de-dfb907355b71':
{
	desc: '標題過濾功能',
	page: { 4: true },
	type: 6,
	options:
	{
		bFilterListButton: { desc: '加入標題過濾列表按扭', defaultValue: true, type: 'checkbox' },
		bAddFilterButton: { desc: '加入新增過濾器按扭', defauleValue: false, type: 'checkbox' }
	},
	once: function()
	{
		var aFilter = AN.util.data('aTopicFilter') || [],
		jHiddenImg,
		jButton = $('<img />', { src: $r['cross-shield'], css: { 'margin-left': '-1.5px' } }).hoverize('#HotTopics tr:not(:first-child)', { autoPosition: false })
		.bind({
			entertarget: function()
			{
				jHiddenImg = jButton.data('hoverize').jTarget.find('img:first').css('visibility', 'hidden');
				jButton.css(jHiddenImg.offset());
			},
			leavetarget: function()
			{
				jHiddenImg.css('visibility', 'visible');
			},
			click: function()
			{
				addFilter(jButton.data('hoverize').jTarget.find('a:first').html().replace(/<img[^>]+?alt="([^"]+)[^>]*>/ig, '$1'));
			}
		});

		var addFilter = function(sTopicName)
		{
			var sFilter = prompt('請輸入過濾器', sTopicName || '');
			if(!sFilter) return;

			aFilter.push(sFilter);
			AN.util.data('aTopicFilter', aFilter);
			filterTopics();
		};

		var filterTopics = this.filterTopics = function(jScope)
		{
			if(!aFilter.length) return;

			var nCount = 0;
			(jScope || $(document)).topics().each(function()
			{
				var jThis = $(this);
				var sTitle = jThis.data('sTitle').toLowerCase();
				$.each(aFilter, function(i, sFilter)
				{
					if(sTitle.indexOf(sFilter.toLowerCase()) != -1) {
						nCount++;
						jThis.hide();
						return false;
					}
				});
			});

			if(nCount) AN.shared('log', $.sprintf('%s個標題已被過濾', nCount));
		};

		if(AN.util.getOptions('bAddFilterButton')) AN.shared('addButton', '新增過濾器', addFilter);

		if(AN.util.getOptions('bFilterListButton')) AN.shared('addButton', '標題過濾列表', function() {
			if(!$('#an-filterlist').length) {
				AN.util.addStyle($.sprintf('\
				#an-filterlist > ul { margin: 5px; } \
				#an-filterlist > ul > li { padding: 2px 0; } \
				#an-filterlist > ul > li > span:first-child { margin-right: 5px; border: 1px solid black; padding: 0 5px; background-color: %(sMainHeaderBgColor)s; color: %(sMainHeaderFontColor)s; cursor: pointer; } \
				',
				AN.util.getOptions()
				));

				AN.shared.box('an-filterlist', '標題過濾列表', 500);

				$('#an-filterlist').click(function(event)
				{
					var jTarget = $(event.target);
					if(!jTarget.is('span:first-child')) return;

					var sFilter = jTarget.next().html();

					var nIndex = $.inArray(sFilter, aFilter);
					if(nIndex != -1) aFilter.splice(nIndex, 1);

					AN.util.data('aTopicFilter', aFilter);
					jTarget.parent().remove();
				});
			}

			var sHTML = '';
			if(aFilter.length) {
				$.each(aFilter, function(i, sFilter)
				{
					sHTML += $.sprintf('<li><span>X</span><span>%s</span></li>', sFilter);
				});
			}
			else {
				sHTML += '<li>沒有任何過濾器</li>';
			}

			$('#an-filterlist').html('<ul>' + sHTML + '</ul>').css('max-height', $.winHeight(0.9));

			AN.shared.gray(true, 'an-filterlist');
		});
	},
	infinite: function(jDoc)
	{
		this.filterTopics(jDoc);
	}
},

'db770fdc-9bf5-46b9-b3fa-78807f242c3c':
{
	desc: '用戶封鎖功能',
	page: { 32: true },
	type: 6,
	once: function()
	{
		AN.util.stackStyle('\
		.an-bammed-msg { color: #999; font-size: 10px; text-align: center; } \
		.an-bammed-msg > span { cursor: pointer; } \
		.an-bammed > td { opacity: 0.5; } \
		.an-bammed > .repliers_left > div > a:first-child ~ *, .an-bammed > td > .repliers_right { display: none; } \
		');

		var bamList = this.bamList = AN.util.data('aBamList') || [],

		jButton = $.userButton().bind({
			click: function()
			{
				var userid = jButton.data('userButton').jTarget.attr('userid');
				var index = $.inArray(userid, bamList);
				index === -1 ? bamList.push(userid) : bamList.splice(index, 1);

				AN.util.data('aBamList', bamList);
				toggleReplies(null);
			},
			buttonshow: function()
			{
				var isBammed = $.inArray(jButton.data('userButton').jTarget.attr('userid'), bamList) !== -1;
				jButton.attr('src', $r[isBammed ? 'tick-shield' : 'cross-shield']).siblings().toggle(!isBammed);
			}
		}),

		tempShown,
		jMsg = $('<div class="an-bammed-msg">( <span></span> )</div>').hoverize('.repliers_left + td', { autoToggle: false, autoPosition: false })
		.bind({
			entertarget: function()
			{
				var jTarget = jMsg.data('hoverize').jTarget;
				if(!jTarget.parent().hasClass('an-bammed')) return;

				var height = jTarget.innerHeight();

				jMsg
				.children().text('Show Blocked User - ' + jTarget.parent().attr('username')).end()
				.css($.extend(jTarget.offset(), { width: jTarget.innerWidth(), height: height, lineHeight: height + 'px' }))
				.show();
			},
			leavetarget: function()
			{
				jMsg.hide();

				if(tempShown) {
					tempShown = false;
					jMsg.data('hoverize').jTarget.parent().addClass('an-bammed');
				}
			},
			click: function(event)
			{
				if(event.target === this) return;

				tempShown = true;
				jMsg.hide().data('hoverize').jTarget.parent().removeClass('an-bammed');
			}
		});

		var toggleReplies = this.toggleReplies = function(jScope)
		{
			(jScope || $(document)).replies().each(function()
			{
				var jThis = $(this);
				jThis.find('tr[userid]').toggleClass('an-bammed', $.inArray(jThis.data('sUserid'), bamList) != -1);
			});
		};
	},
	infinite: function(jDoc)
	{
		if(this.bamList.length) this.toggleReplies(jDoc);
	}
},

'7906be8e-1809-40c1-8e27-96df3aa229d8':
{
	desc: '用戶高亮功能',
	page: { 32: true },
	type: 6,
	once: function()
	{
		var highlightList = this.highlightList = [],

		jButton = $.userButton().bind({
			click: function()
			{
				var userid = jButton.data('userButton').jTarget.attr('userid');
				var index = $.inArray(userid, highlightList);
				index === -1 ? highlightList.push(userid) : highlightList.splice(index, 1);

				toggleReplies(null);
			},
			buttonshow: function()
			{
				jButton.attr('src', $r[jButton.data('userButton').jTarget.hasClass('an-highlighted') ? 'highlighter--minus': 'highlighter--plus']);
			}
		});

		AN.util.stackStyle($.sprintf('.an-highlighted > td { background-color: %s !important; }', AN.util.getOptions('sHighlightBgColor')));

		var toggleReplies = this.toggleReplies = function(jScope)
		{
			(jScope || $(document)).replies().each(function()
			{
				var jThis = $(this);
				jThis.find('tr[userid]').toggleClass('an-highlighted', $.inArray(jThis.data('sUserid'), highlightList) != -1);
			});
		};
	},
	infinite: function(jDoc)
	{
		if(this.highlightList.length) this.toggleReplies(jDoc);
	}
},

'e82aa0ba-aa34-4277-99ea-41219dcdacf2':
{
	desc: '用戶單獨顯示功能',
	defer: 1,
	page: { 32: true },
	type: 6,
	once: function()
	{
		var oFn = this,
		jButton = $.userButton().bind({
			click: function()
			{
				oFn.targetId = oFn.targetId ? null : jButton.data('userButton').jTarget.attr('userid');
				toggleReplies(null);
			},
			buttonshow: function()
			{
				jButton.attr('src', $r[oFn.targetId ? 'magnifier-zoom-out' : 'magnifier-zoom-in']);
			}
		});

		var toggleReplies = this.toggleReplies = function(jScope)
		{
			(jScope || $(document)).replies().each(function()
			{
				var jThis = $(this);
				jThis.closest('div > table').toggle(!oFn.targetId || jThis.data('sUserid') === oFn.targetId);
			});
		};
	},
	infinite: function(jDoc)
	{
		if(this.targetId) this.toggleReplies(jDoc);
	}
},

'fc07ccda-4e76-4703-8388-81dac9427d7c':
{
	desc: '強制顯示空白用戶名連結',
	page: { 32: true },
	type: 6,
	once: function()
	{
		AN.util.stackStyle('.an-nameforcedshown:before { content: "<空白名稱>"; font-style: italic; }');
	},
	infinite: function(jDoc)
	{
		jDoc.replies().jNameLinks.filter(function(){ return $(this).width() === 0; }).addClass('an-nameforcedshown');
	}
},

'63333a86-1916-45c1-96e0-f34a5add67c1':
{
	desc: '限制回覆高度',
	page: { 32: false },
	type: 6,
	options: {
		replyMaxHeight: { desc: '最大高度(px)', type: 'text', defaultValue: 2000 }
	},
	once: function()
	{
		var maxHeight = AN.util.getOptions('replyMaxHeight');

		AN.util.stackStyle('\
		.repliers_right, .repliers_right > tbody, .repliers_right > tbody > tr, .repliers_right > tbody > tr > td { display: block; } \
		.repliers_right > tbody > tr:first-child { max-height: '+maxHeight+'px; overflow-y: hidden; } \
		.an-maxheightremoved > .repliers_right > tbody > tr:first-child { max-height: none; } \
		#an-heighttoggler { margin: -14px 0 0 3.5px; } \
		#an-heighttoggler > img { padding: 7px 3.5px; cursor: pointer; } \
		');

		var jButton = $('<div id="an-heighttoggler"><img src="'+$r['control-eject']+'" /><img src="'+$r['control-stop-270']+'" /><img src="'+$r['control-270']+'" /></div>')
		.hoverize('.repliers_left + td', {
			filter: function(){ return $(this).hasClass('an-maxheightremoved') || $(this).find('td:first').innerHeight() > maxHeight; },
			autoPosition: false
		})
		.bind({
			entertarget: function()
			{
				var jTarget = jButton.data('hoverize').jTarget,
				showFirst = jTarget.hasClass('an-maxheightremoved'),
				offset = jTarget.offset();

				jButton.css({ top: offset.top + jTarget.height(), left: offset.left }).children(':first').toggle(showFirst).nextAll().toggle(!showFirst);
			},
			click: function(event)
			{
				var data = jButton.data('hoverize');
				data.fixScroll = $(event.target).index() === 2 ? 'top' : 'bottom';
				data.fixScroll_difference = data.jTarget[data.fixScroll]() - $d.scrollTop();
				data.jTarget.toggleClass('an-maxheightremoved');
			}
		});
	}
},

'7b36188f-c566-46eb-b48d-5680a4331c1f':
{
	desc: '轉換論壇連結的伺服器位置',
	page: { 32: true },
	type: 6,
	once: function()
	{
		var rForum = /forum\d*.hkgolden\.com/i;
		$d.mousedown(function(event)
		{
			var jTarget = $(event.target);
			if(!( jTarget.is('.repliers_right > tbody > tr:first-child a') && rForum.test(jTarget.attr('href')) )) return;

			jTarget.attr('href', jTarget.attr('href').replace(rForum, location.hostname));
		});
	}
},

'e33bf00c-9fc5-46ab-866a-03c4c7ca5056':
{
	desc: '轉換文字連結成連結',
	page: { 32: true },
	type: 6,
	once: function()
	{
		AN.util.stackStyle('.an-linkified { padding-right: 2px; }');
	},
	infinite: function(jDoc)
	{
		var rLink = /(?:https?|ftp):\/\/(?:[\w-]+\.)+[a-z]{2,3}(?![a-z])(?:\/[\w.\/?:;~!@#$%^&*()+=-]*)?/i;
		jDoc.replies().jContents.each(function()
		{
			if(rLink.test($(this).text())) {
				var node, match, next = this.firstChild;
				while(node = next) {
					if(node.nodeType === 3 && (match = rLink.exec(node.data))) {
						node.splitText(match.index + match[0].length);

						$(node.splitText(match.index))
						.before('<img title="已轉換文字為連結" class="an-linkified" src="'+$r['chain--arrow']+'" />')
						.wrap($.sprintf('<a href="%s"></a>', match[0]));

						node = node.nextSibling.nextSibling.nextSibling;
						continue;
					}

					next = !/^(?:a|button|script|style)$/i.test(node.nodeName) && node.firstChild || node.nextSibling;
					while(!next && (node = node.parentNode)) next = node.nextSibling;
				}
			}
		});
	}
},

'422fe323-e61e-47d9-a348-d40011f5da28':
{
	desc: '連結封鎖功能',
	page: { 32: false },
	type: 6,
	once: function()
	{
		AN.util.stackStyle('\
		.repliers_right a[target] { display: inline-block; } \
		a[href].an-linkblocked { text-decoration: line-through; font-style: italic; cursor: default; } \
		a[target].an-linkblocked:before { content: attr(rel); } \
		a[target].an-linkblocked > img { display: none; } \
		#an-linkblocktoggler { margin: -16px 0 0 -34px; padding: 16px; padding-right: 2px; } \
		');

		var
		blockList = this.blockList = AN.util.data('linkBlockList') || [],
		rInternal = /^http:\/\/(?:[^.]+.)hkgolden\.com/,

		jButton = $('<img />', { id: 'an-linkblocktoggler' })
		.hoverize('.repliers_right > tbody > tr:first-child a', {
			filter: function(){ return $(this).hasClass('an-linkblocked') || !rInternal.test(this.href); },
			fixScroll: 'top'
		})
		.bind({
			entertarget: function()
			{
				jButton.attr('src', $r[jButton.data('hoverize').jTarget.hasClass('an-linkblocked') ? 'tick-shield' : 'cross-shield']);
			},
			click: function()
			{
				var
				jTarget = jButton.data('hoverize').jTarget,
				isBlocked = jTarget.hasClass('an-linkblocked'),
				hrefAttr = isBlocked ? 'rel' : 'href',
				realHref = jTarget.attr(hrefAttr),
				jLinks = $(document).replies().jContents.find('a').filter(function(){ return this[hrefAttr] === realHref; }).toggleClass('an-linkblocked');

				if(isBlocked) {
					jLinks.attr({ href: realHref });
					blockList.splice($.inArray(realHref, blockList), 1);
				}
				else {
					jLinks.attr({ href: 'javascript:', rel: realHref });
					blockList.push(realHref);
				}

				AN.util.data('linkBlockList', blockList);
			}
		});
	},
	infinite: function(jDoc, fn)
	{
		jDoc.replies().jContents.find('a').filter(function(){ return $.inArray(this.href, fn.blockList) !== -1; }).toggleClass('an-linkblocked').each(function()
		{
			$(this).attr({ href: 'javascript:', rel: this.href });
		});
	}
},

'd761d6f7-8ef7-4d5b-84e9-db16a274f616':
{
	desc: '轉換圖片連結成圖片',
	page: { 32: false },
	type: 6,
	options: {
		imageConvertMode: { desc: '轉換模式', type: 'select', choices: ['自動轉換', '自動轉換(引用中的連結除外)', '手動轉換'], defaultValue: '自動轉換(引用中的連結除外)' }
	},
	once: function()
	{
		AN.util.stackStyle('\
		.an-imagified { padding-left: 2px; } \
		.an-imagified + a { display: block; } \
		.an-imagified + a > img { border: 0; } \
		');

		var rImg = /\.(?:jpe?g|gif|png|bmp)\b/i;

		$d.bind('click imageconvert', function(event)
		{
			var jTarget = $(event.target);
			if(jTarget.next('.an-imagified').length) {
				event.preventDefault();
				jTarget.next().next().toggle();
			}
			else if(jTarget.children().length === 0 && (event.type === 'imageconvert' || jTarget.is('.repliers_right > tbody > tr:first-child a')) && rImg.test(event.target.href)) {
				event.preventDefault();

				$('<img title="已轉換連結為圖片" class="an-imagified" src="'+$r['image-export']+'" />')
				.insertAfter(jTarget)
				.after($.sprintf('<a href="%(url)s" target="_blank"><img onload="DrawImage(this)" src="%(url)s" alt="%(url)s" /></a>', { url: event.target.href }));
			}
		});
	},
	infinite: function(jDoc)
	{
		var convertMode = $.inArray(AN.util.getOptions('imageConvertMode'), this.options.imageConvertMode.choices);
		if(convertMode !== 2) jDoc.replies().jContents.find(convertMode === 0 ? 'a' : 'a:not(blockquote a)').trigger('imageconvert');
	}
},

'8e1783cd-25d5-4b95-934c-48a650c5c042':
{
	desc: '圖片屏蔽功能',
	page: { 32: false },
	type: 6,
	options: {
		imageMaskMode: { desc: '屏蔽模式', type: 'select', choices: ['自動屏蔽', '自動屏蔽(只限引用中的圖片)', '手動屏蔽'], defaultValue: '自動屏蔽(只限引用中的圖片)' }
	},
	once: function()
	{
		var maskMode = $.inArray(AN.util.getOptions('imageMaskMode'), this.options.imageMaskMode.choices);
		var selector = {
			0: '.repliers_right img[src][onload],',
			1: '.repliers_right blockquote img[onload],',
			2: ''
		}[maskMode];

		AN.util.stackStyle(selector + 'img[onload].an-maskedImage { padding: 52px 48px 0 0; width: 0; height: 0; background: url('+$r['gnome-mime-image-bmp']+') no-repeat; }');

		if(maskMode !== 2) {
			AN.util.stackStyle('img[src][onload].an-unmaskedImage { padding: 0; width: auto; height: auto; background: none; }');
		}

		var jButton = $('<img />', { src: $r['picture--minus'], css: { 'margin-top': '-2px' } })
		.hoverize('.repliers_right img[onload]', { filter: function(){ return $(this).width(); } })
		.click(function()
		{
			jButton.data('hoverize').jTarget.addClass('an-maskedImage').removeClass('an-unmaskedImage');
		});

		$d.bind('click', function(event)
		{
			var jTarget = $(event.target);
			if(jTarget.is('img[onload]') && jTarget.width() === 0) {
				event.preventDefault();
				jTarget.addClass('an-unmaskedImage').removeClass('an-maskedImage').mouseover();
			}
		});
	}
},

'039d820f-d3c7-4539-8647-dde974ceec0b':
{
	desc: '轉換視頻網站連結成影片',
	page: { 32: true },
	type: 6,
	defer: 2, // after layout is fixed
	options: {
		videoConvertMode: { desc: '轉換模式', type: 'select', choices: ['自動轉換', '自動轉換(引用中的連結除外)', '手動轉換'], defaultValue: '自動轉換(引用中的連結除外)' }
	},
	once: function()
	{
		var nWidth, nHeight, sUrl;
		var aSites =
		[{
			regex: 'youtube\\.com/watch\\?',
			fn: function()
			{
				if(nWidth > 640) nWidth = 640;
				nHeight = nWidth / 16 * 9 + 25;
				sUrl = $.sprintf('http://www.youtube.com/v/%s&fs=1&rel=0&ap=%%2526fmt%%3D22', sUrl.replace(/.+?v=([^&]+).*/i, '$1'));
			}
		},
		{
			regex: 'vimeo\\.com/\\d',
			fn: function()
			{
				if(nWidth > 504) nWidth = 504;
				nHeight = nWidth / 1.5;
				sUrl = $.sprintf('http://vimeo.com/moogaloop.swf?clip_id=%s&show_title=1&fullscreen=1', sUrl.replace(/.+vimeo\.com\/(\d+).*/i, '$1'));
			}
		},
		{
			regex: 'youku\\.com/v_show/',
			fn: function()
			{
				if(nWidth > 480) nWidth = 480;
				nHeight = nWidth / 4 * 3 + 40;
				sUrl = $.sprintf('http://player.youku.com/player.php/sid/%s/v.swf', sUrl.replace(/.+?id_([^\/]+).*/i, '$1'));
			}
		},
		{
			regex: 'tudou\\.com/programs/',
			fn: function()
			{
				if(nWidth > 420) nWidth = 420;
				nHeight = nWidth / 4 * 3 + 48;
				sUrl = $.sprintf('http://www.tudou.com/v/%s', sUrl.replace(/.+?view\/([^\/]+).*/i, '$1'));
			}
		}];
		var rLink = (function()
		{
			var aReg = [];
			$.each(aSites, function(){ aReg.push(this.regex); });
			return new RegExp(aReg.join('|'), 'i');
		})();

		AN.util.stackStyle('\
		.an-videoified { padding-left: 2px; } \
		.an-videoified + object { display: block; outline: 0; } \
		');

		$d.bind('click videoconvert', function(event)
		{
			var jTarget = $(event.target);
			if(jTarget.next('.an-videoified').length) {
				event.preventDefault();
				jTarget.next().next().toggle();
			}
			else if((event.type === 'videoconvert' || jTarget.is('.repliers_right > tbody > tr:first-child a')) && rLink.test(event.target.href)) {
				event.preventDefault();

				sUrl = event.target.href;
				nWidth = jTarget.up('td,div').width();
				$.each(aSites, function()
				{
					if(RegExp(this.regex, 'i').test(sUrl)) {
						this.fn();
						return false;
					}
				});

				$('<div></div>')
				.insertAfter(jTarget)
				.toFlash(sUrl, { width: nWidth, height: nHeight.toFixed(0) }, { wmode: 'opaque', allowfullscreen: 'true' })
				.before('<img title="已轉換連結為影片" class="an-videoified" src="'+$r['film--arrow']+'" />');
			}
		});
	},
	infinite: function(jDoc, oFn)
	{
		var convertMode = $.inArray(AN.util.getOptions('videoConvertMode'), this.options.videoConvertMode.choices);
		if(convertMode !== 2) jDoc.replies().jContents.find(convertMode === 0 ? 'a' : 'a:not(blockquote a)').trigger('videoconvert');
	}
},

'a7484cf2-9cbd-47aa-ac28-472f55a1b8f4':
{
	desc: '需要時自動加入代碼插入按扭',
	page: { 288: true },
	type: 6,
	once: function()
	{
		var rUrl, jUrlBtn, rImg, jImgBtn, text, match;
		var jTextarea = $('#ctl00_ContentPlaceHolder1_messagetext').bind('keyup mouseup change', function()
		{
			if(!rUrl)
			{
				var parts = {
					host: 'http://(?:[\\w-]+\\.)+[a-z]{2,4}(?![a-z])',
					codes: '\\[/?(?:img|url|quote|\\*|left|center|right|b|i|u|s|size|red|green|blue|purple|violet|brown|black|pink|orange|gold|maroon|teal|navy|limegreen)'
				};

				rUrl = new RegExp($.sprintf('%(host)s(?:/(?:(?!%(codes)s)\\S)*)?(?!(\\S*?| *)\\[/(?:img|url)])', parts), 'gi');
				jUrlBtn = $('<button type="button" style="vertical-align: top; margin-left: 5px; display: none;" />').insertAfter('#ctl00_ContentPlaceHolder1_btn_Submit').click(function()
				{
					jTextarea.val(text.replace(rUrl, '[url]$&[/url]')).change();
				});

				rImg = new RegExp($.sprintf('%(host)s/(?:(?!%(codes)s)\\S)+?\\.(?:bmp|jpe?g|png|gif)(?! *\\[/(?:img|url)])', parts), 'gi');
				jImgBtn = $('<button type="button" style="vertical-align: top; margin-left: 5px; display: none;" />').insertAfter(jUrlBtn).click(function()
				{
					jTextarea.val(text.replace(rImg, '[img]$&[/img]')).change();
				});
			}

			text = jTextarea.val();
			(match = text.match(rUrl)) ? jUrlBtn.html($.sprintf('為%s個連結加上[url]代碼', match.length)).show() : jUrlBtn.hide();
			(match = text.match(rImg)) ? jImgBtn.html($.sprintf('為%s個圖片連結加上[img]代碼', match.length)).show() : jImgBtn.hide();
		});
	}
},

'1fb17624-7c6f-43aa-af11-9331f1f948cb':
{
	desc: '強化表情圖示列',
	page: { 288: true },
	type: 6,
	options: { sSmileySelectMethod: { desc: '圖示選擇方式', defaultValue: '列表', type: 'select', choices: ['列表', '連結'] } },
	once: function()
	{
		// jQuery('#TABLE_ID').outer().replace(/>\s+</g, '><').replace(/&nbsp;\s+/g, '&nbsp;').replace(/'/g,'\\\'');
		if(!$('#ctl00_ContentPlaceHolder1_messagetext').length) return;

		var selector = '#ctl00_ContentPlaceHolder1_QuickReplyTable table table > tbody > tr:first-child + tr + tr + tr';
		if($('#ctl00_ContentPlaceHolder1_Forum_Type_Row').length) selector += '+ tr + tr';
		selector += '> td:first-child';

		AN.util.stackStyle('\
		'+selector+' { cursor: pointer; } \
		'+selector+':before { content: url('+$r['smiley-twist']+'); margin-right: 2px; vertical-align: middle; } \
		');

		$d.bind('click.smileyadder', function(event)
		{
			var jSmileyTr = $('#ctl00_ContentPlaceHolder1_messagetext').up('tr').next();

			if(jSmileyTr.length && jSmileyTr.children(':first')[0] !== event.target) return;

			$d.unbind('click.smileyadder');

			AN.util.addStyle('\
			'+selector+' { cursor: default; } \
			'+selector+':before { content: ""; display: none; } \
			');

			jSmileyTr.children(':last').append(function()
			{
				var tableHTML = '';
				$.each($s, function()
				{
					var html = this.html;

					tableHTML += '<table style="display: none" cellpadding="0" cellspacing="0"><tbody>';

					$.each(html.table, function(rowNo, row)
					{
						function writeLink(smileyNo, smiley)
						{
							tableHTML += $.sprintf(
								'<a href="javascript:InsertText(\'%(code)s\',false)"><img style="border: 0" src="%(path)s/%(filename)s.gif" alt="%(code)s" /></a>&nbsp;',
								{ code: smiley[0], path: html.path, filename: smiley[1] }
							);
						}

						tableHTML += '<tr>';

						tableHTML += rowNo == 0 ? '<td colspan="2">' : '<td>';
						$.each(row, writeLink);
						tableHTML += '</td>';

						if(rowNo == 1 && html.span) {
							tableHTML += '<td valign="bottom" rowspan="2">';
							$.each(html.span, writeLink);
							tableHTML += '</td>';
						}

						tableHTML += '</tr>';
					});

					tableHTML += '</tbody></table>';
				});
				return tableHTML;
			});

			if(AN.util.getOptions('sSmileySelectMethod') === '列表') {
				var selectHTML = '<select><option>經典表情圖示</option>';
				$.each($s, function()
				{
					selectHTML += '<option>' + this.desc + '</option>';
				});
				selectHTML += '</select>';

				$(selectHTML).change(function()
				{
					jSmileyTr.children(':last').children().hide().eq(this.selectedIndex).show();
				}).appendTo(jSmileyTr.children(':first').empty()).after(':');
			}
			else {
				AN.util.addStyle('#an-smileyselector { list-style: none; margin: 0; padding: 0; font-size: 80%; }');

				var listHTML = '<ul id="an-smileyselector"><li><a href="javascript:">經典表情圖示</a></li>';
				$.each($s, function()
				{
					listHTML += '<li><a href="javascript:">' + this.desc + '</a></li>';
				});
				listHTML += '</ul>';

				$(listHTML).click(function(event)
				{
					var jTarget = $(event.target);
					if(!jTarget.is('a')) return;

					jSmileyTr.children(':last').children().hide().eq(jTarget.parent().index()).show();
				}).appendTo(jSmileyTr.children(':first').empty());
			}
		});
	}
},

'e336d377-bec0-4d88-b6f8-52e122f4d1c9':
{
	desc: '加入自訂文字插入控件',
	page: { 288: true },
	type: 5,
	once: function()
	{
		if(!$('#ctl00_ContentPlaceHolder1_messagetext').length) return;

		var snippets = AN.util.data('snippets') || [
			['家姐潮文', '講起我就扯火啦\n我家姐一路都在太古廣場一間名店做sales\n間店有好多有錢人同名人幫襯\n做了很多年，已經是senior\n咁多年黎都好俾心機做，經理亦好 like佢\n因為收入不錯又隱定，家姐原本諗住同拍拖多年既bf結婚\n咁多年黎我家姐好少俾人投訴\n而且同好多大客既關係都唔錯\n前排關心研去過我家姐間店幫襯\n不過serve佢既不是我家姐，但佢一買就買左好多野\n過左個幾星期，佢又再去間店行\n上次serve果個Day-off, 咁我家姐就頂上serve佢\n開頭已經好有禮貌介紹d新貨俾佢, 仲話俾折頭佢\n佢就無乜反應，望一望另一堆客\n果堆客係大陸人，三至四個，講野好大聲\n關小姐就同我家姐講話可唔可以關左間鋪一陣\n等佢揀衫\n 我家姐同我講，佢公司一向唔俾佢地咁做\n驚做壞個頭，除非真係有乜大人物，好多記者好混亂先可以咁做\n但佢見到關小姐黑口黑面，都識做話打電話去問一問老闆\n老闆梗係話唔得啦，至多俾多d折頭她\n咁關小姐就發老脾，鬧到我家姐一面屁\nd說話勁難聽，又話自己買野既錢多過我家姐搵幾年既錢\n我家姐都唔敢得罪佢，一味道歉\n跟住關小姐就走左人，家姐就同老闆備案\n老闆瞭解左情況就無再追問\n過左兩日佢接到老闆電話話收到complaint \n話有人投訴佢態度唔好，唔理顧客感受\n公司policy一向唔話俾佢地知係邊次事件\n我家姐估黎估去都淨係得失過關小姐一人\n總之俾老闆話左兩句\n又過幾日，關小姐又黎\n這次和件西裝友一齊，但好在成店都無其他客\n我家姐怕又惹事，叫左個junior過去serve佢\n點知條老西友係要點番我家姐serve.\n根住關小姐就玩野，試衫，但話d衫俾其他人試過污糟\n要開新衫試，我家姐雖然知公司唔俾咁做，\n但怕左佢，唯有照做\n點知試左兩三件，件件佢都要咁試又無話要\n我家姐終於話唔好意思，其實唔可以咁做\n(根本明知她玩野啦.....)\n又係至多俾多d折頭佢\n跟住佢件西裝友就鬧我家姐話"係咪話我地無錢買你地d野?"\n我家姐話唔係，但佢照鬧\n鬧左十幾分鐘\nd同事見咁幫手，又照鬧\n最終打俾老闆備案\n之後連收兩封warning letter\n早兩日接埋大信封\n年尾俾人炒左']
		];
		var jSelect = $('<select></select>');

		function writeSelect()
		{
			var selectHTML = '<option>自訂文字</option>';
			$.each(snippets, function(textNo)
			{
				selectHTML += $.sprintf('<option value="%s">%s</option>', textNo, this[0]);
			});
			selectHTML += '<option value="customize">自訂...</option>';

			jSelect.html(selectHTML);
		}

		writeSelect();

		var jSnippets;
		jSelect.insertBefore($('#ctl00_ContentPlaceHolder1_messagetext').prev()).change(function()
		{
			if(this.value == 'customize') {
				if(!jSnippets) {
					AN.util.addStyle($.sprintf('\
					#an-snippets { padding: 5px; } \
					#an-snippets > ul { height: 350px; overflow: auto; } \
					#an-snippets > ul > li { padding: 2px 0; } \
					#an-snippets > ul > li > span { margin-right: 5px; border: 1px solid black; padding: 0 5px; background-color: %(sMainHeaderBgColor)s; color: %(sMainHeaderFontColor)s; cursor: pointer; } \
					#an-snippets > div { float: right; margin-left: 10px; padding-left: 10px; text-align: center; border-left: 1px solid gray; } \
					#an-snippets > div > textarea { display: block; width: 400px; height: 300px; } \
					',
					AN.util.getOptions()
					));

					var index, editing, jDesc, jContent;
					jSnippets = AN.shared.box('an-snippets', '自訂文字', 700)
					.append('<div><input /><textarea></textarea><button type="button">ok</button><button type="button">cancel</button></div><ul></ul>')
					.click(function(event)
					{
						var jTarget = $(event.target);
						if(!jTarget.is('span,button')) return;

						var type = jTarget.text();
						if(type == 'cancel') {
							jSnippets.children('div').css('opacity', '0.5').children().attr('disabled', true);
						}
						else if(type == 'E' || type == '+') {
							editing = (type === 'E');
							index = jTarget.parent().index();
							jDesc.val(type == 'E' ? snippets[index][0] : '').next().val(type == 'E' ? snippets[index][1] : '').parent().css('opacity', '1').children().attr('disabled', false);
						}
						else {
							if(type == 'ok') {
								if(editing) {
									snippets[index] = [jDesc.val(), jContent.val()];
									editing = false;
								}
								else {
									snippets.push([jDesc.val(), jContent.val()]);
								}
							}
							else if(type == 'X' && confirm('確定移除?')) {
								snippets.splice(jTarget.parent().index(), 1);
							}
							AN.util.data('snippets', snippets);
							writeSnippets();
							writeSelect();
						}
					});
				}
				jDesc = jSnippets.find('> div > input');
				jContent = jDesc.next();

				function writeSnippets()
				{
					var sHTML = '';
					$.each(snippets, function()
					{
						sHTML += '<li><span>X</span><span>E</span>' + this[0] + '</li>';
					});
					sHTML += '<li><span>+</span>...</li>';
					jSnippets.children('ul').html(sHTML).next().css('opacity', '0.5').children().val('').attr('disabled', true);
				}

				writeSnippets();
				AN.shared.gray(true, 'an-snippets');
			}
			else {
				window.InsertText(snippets[this.value][1], false);
			}

			this.selectedIndex = 0;
		});
	}
}

}};