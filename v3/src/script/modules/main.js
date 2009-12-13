AN.mod['Main Script'] = { ver: 'N/A', author: '向日', fn: {

// 佈局設定 //
'63d2407a-d8db-44cb-8666-64e5b76378a2':
{
	desc: '隱藏廣告',
	page: { 65535: true },
	type: 3,
	options: { 'bRetroHideAds': { desc: '相容性模式', defaultValue: false, type: 'checkbox' } },
	once: function()
	{
		$.each(
		{
			65535: '\
			#HKGTopAd { display: none; } \
			',
			// default
			2: '\
			#ctl00_ContentPlaceHolder1_MiddleAdSpace1, /* text ad */\
			.ContentPanel > div > div:first-child, /* flash ad */\
			#ctl00_ContentPlaceHolder1_lb_NewPM + br /* blank line */\
				{ display: none; } \
			',
			// topics
			4: '\
			.ContentPanel > table { width: 100%; } \
			.ContentPanel > table > tbody > tr > td:first-child { width: auto !important; } \
			.ContentPanel > table > tbody > tr > td:first-child + td \
				{ display: none; } \
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
			div[style*="58px"], /* top & bottom ads */\
			#ctl00_ContentPlaceHolder1_view_form > div > table[width="100%"] > tbody > tr + tr /* inline ads */\
				{ display: none; } \
			div[style*="%s"] { border-bottom: 0 !important; } \
			',
			$.browser.msie ? 'PADDING-BOTTOM: 18px' : 'padding: 18px'
			)
			,
			// topics, search, tags, view
			60: '\
			#ctl00_ContentPlaceHolder1_MiddleAdSpace1 div[style*="right"] { display: none; } /* text ad */\
			',
			// default, topics, search, tags, view
			62: '\
			#MainPageAd2 + br + br + div { padding-bottom: 10px !important; } \
			#MainPageAd2, #MainPageAd2 ~ br, /* text ads */\
			#ctl00_ContentPlaceHolder1_lb_NewPM + br \
				{ display: none; } \
			',
			// profilepage
			64: '\
			/* inline ads */\
			.main_table1 tr { display: none; } \
			.main_table1 tr[style], .main_table1 tr:first-child, #ctl00_ContentPlaceHolder1_ProfileForm > table > tbody > tr > td > table:first-child .main_table1 tr { display: table-row; } \
			'
		},
		function(nPageCode){ $().pageCode() & nPageCode && AN.util.stackStyle(this); });

		if(AN.util.getOptions('bRetroHideAds'))
		{
			AN.util.stackStyle('td[height="52"] { display: none; }');
		}
		else if($().pageCode() & 28)
		{
			if($.browser.msie)
			{
				AN.util.stackStyle($.sprintf(
				$().pageName() == 'topics'
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
				$().pageName() == 'topics'
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
		if($.browser.msie && $().pageCode() == 32) $('div[style*="PADDING-BOTTOM: 18px"]').css('border-bottom', 0); // yet another IE8 bug!?

		if(AN.util.getOptions('bRetroHideAds'))
		{
			$('td[height="52"]').parent().hide();
		}
	}
},

// 修正修改 //
'11f1c5ca-9455-4f8e-baa7-054b42d9a2c4':
{
	desc: '自動轉向正確頁面',
	page: { 2: true },
	type: 4,
	once: function()
	{
		if(document.referrer.indexOf('/login.aspx') > 0) location.replace('/topics.aspx?type=BW');
		else if(!location.pathname.match(/^\/(?:default.aspx)?$/i)) location.reload();
	}
},

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

'2d4e139c-224c-44fb-824e-606170276c76':
{
	desc: 'IE: 修正用戶名稱搜尋連結',
	page: { 92: $.browser.msie || 'disabled' },
	type: 4,
	infinite: function(jDoc)
	{
		jDoc.topics().jNameLinks.each(function()
		{
			this.href = '/search.aspx?st=A&searchstring=' + escape($(this).html());
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

/*
'c2d9eedb-bb6c-4cb4-be11-ea2ec9612f63':
{
	desc: '修正底部的論壇功能',
	page: { 28: true },
	type: 4,
	once: function()
	{
		$('select').filter(function(){ return /^(?:page|md|mt)$/.test(this.name); }).change(function(event)
		{
			event.stopImmediatePropagation();

			var oParam = {};
			oParam[this.name] = $(this).val();
			location.assign(AN.util.getURL(oParam));
		});
	}
},
*/

'0293c9da-468f-4ed5-a2d7-ecb0067e713f':
{
	desc: '去除引用半透明',
	page: { 32: !$.browser.msie || 'disabled' },
	type: 4,
	once: function()
	{
		AN.util.stackStyle('blockquote { opacity: 1 !important; }');
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
	},
	infinite: function(jDoc)
	{
		jDoc.find('select[name=page]').up('tr').find('a').each(function()
		{
				this.href = this.href.replace(/&(?:page=1(?!\d)|highlight_id=0)/g, '');
		});
	}
},

'b6b232c8-1f26-449e-bb0d-2b7826bf95ef':
{
	desc: '優化圖片縮放',
	page: { 32: true, 192: true },
	type: 4,
	once: function(jDoc)
	{
		window.DrawImage = $.blank;

		AN.util.stackStyle('img[onload] { width: auto; height: auto; max-width: 100% }');
	}
},

'52ebe3d3-bf98-44d2-a101-180ec69ce290':
{
	desc: '移除帖子連結高亮部份',
	page: { 64: false },
	type: 4,
	infinite: function(jDoc)
	{
		jDoc.topics().jTitleCells.find('a').each(function()
		{
				this.href = this.href.replace(/&highlight_id=\d+/, '');
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
			var sType = $('#st').val(); // $('#st option:selected')[0].value;
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
	infinite: function(jDoc)
	{
		if(AN.util.getOptions('bTopicLinksOnly'))
		{
			jDoc.topics().jTitleCells.find('a').attr('target', '_blank');
		}
		else
		{
			$('#aspnetForm a').filter(function(){ return /(?:ProfilePage|newmessages|view|search)\.aspx/.test(this.href); }).attr('target', '_blank');
		}
	}
},

'2ab2f404-0d35-466f-98a5-c88fdbdaa031':
{
	desc: '外鏈連結開新頁',
	defer: 1, // after links are created
	page: { 32: true },
	type: 4,
	infinite: function(jDoc)
	{
		jDoc.replies().jContents.find('a').attr('target', '_blank');
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
		if(AN.util.cookie('companymode') == 'Y')
		{
			$('head').append($.sprintf('<link rel="shortcut icon" href="%s" />', AN.util.getOptions('sCModeFavicon')));
			document.title = AN.util.getOptions('sCModeTitle');
		}
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
			$('#ctl00_ContentPlaceHolder1_btn_Submit').click();
		});
	}
},

'69260bc4-4f43-4dda-ba0f-87ba804a866c':
{
	desc: '加入同步登入所有server的按扭',
	page: { 65534: false },
	type: 5,
	once: function()
	{
		AN.shared('addButton', '登入所有server', function()
		{
			var sEmail, sPass;
			if(!(sEmail = prompt('請輸入電郵地址', ''))) return;
			if(!(sPass = prompt('請輸入密碼', ''))) return;

			var nServer = 8;

			var aLeft = [];
			for(var i=1; i<=nServer; i++)	aLeft.push(i);

			var complete = function(bForce)
			{
				if(aLeft.length === 0 || bForce)
				{
					alert($.sprintf('登入完成!%s\n\n點擊確定重新整理頁面.', aLeft.length ? $.sprintf('\n\n伺服器%s登入失敗!', aLeft.join(',')) : ''));
					location.reload();
				}
			};

			var login = function(nForum)
			{
				var doc = this.contentWindow.document;
				var jThis = $(this);

				if(!doc.getElementById('aspnetForm')) // error page
				{
					AN.shared('log', $.sprintf('伺服器%s登入失敗!', nForum));
					complete();
					return;
				}

				var _$ = this.contentWindow.jQuery;

				_$('#ctl00_ContentPlaceHolder1_txt_email').val(sEmail);
				_$('#ctl00_ContentPlaceHolder1_txt_pass').val(sPass);

				_$.post('login.aspx', _$('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24linkb_login=', function()
				{
					$.each(aLeft, function(i, n)
					{
						if(n == nForum)
						{
							aLeft.splice(i, 1);
							return false;
						}
					});

					AN.shared('log', $.sprintf('伺服器%s登入成功!', nForum));
					complete();
				});
			};

			AN.shared('log', '登入各伺服器中, 請稍候...');

			$.each(aLeft, function(i, nForum)
			{
				$('<iframe style="display: none;"></iframe>')
				.appendTo('#an')
				.attr('src', $.sprintf('http://forum%s.hkgolden.com/login.aspx', nForum))
				.load(function()
				{
					login.call(this, nForum);
				})
				.error(function()
				{
					AN.shared('log', $.sprintf('伺服器%s登入失敗!', nForum));
					complete();
				});
			});

			setTimeout(function(){ complete(true); }, 10000);
		});
	}
},

'13c276a5-f84e-4f53-9ada-45545ccc6b2e':
{
	desc: '加入同步登出所有server的按扭',
	page: { 65534: false },
	type: 5,
	once: function()
	{
		AN.shared('addButton', '登出所有server', function()
		{
			if(!confirm('確定登出所有server?')) return;

			var nServer = 8;

			var aLeft = [];
			for(var i=1; i<=nServer; i++)	aLeft.push(i);

			var complete = function(bForce)
			{
				if(aLeft.length === 0 || bForce)
				{
					alert($.sprintf('登出完成!%s\n\n點擊確定重新整理頁面.', aLeft.length ? $.sprintf('\n\n伺服器%s登出失敗!', aLeft.join(',')) : ''));
					location.reload();
				}
			};

			AN.shared('log', '登出各伺服器中, 請稍候...');

			$.each(aLeft, function(i, nForum)
			{
				$($.sprintf('<img src="http://forum%s.hkgolden.com/logout.aspx" />', nForum))
				.appendTo('#an')
				.error(function()
				{
					$.each(aLeft, function(i, n)
					{
						if(n == nForum)
						{
							aLeft.splice(i, 1);
							return false;
						}
					});

					AN.shared('log', $.sprintf('伺服器%s登出完成!', nForum));
					complete();
				});
			});

			setTimeout(function(){ complete(true); }, 10000);
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
		//if($().pageName() == 'topics') return;
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
		AN.shared('addLink', '最頂', function(){ scrollTo(0,0); }, 0);
		AN.shared('addLink', '最底', function(){ $('body')[0].scrollIntoView(false); }, 2);
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

			sText = sText.replace(rSmiley, '<img style="border-width:0px;vertical-align:middle" src="/faces/$1.gif" alt="$&" />');

			$.each(aConvertMap, function()
			{
				sText = sText.replace(this.regex, '<img style="border-width:0px;vertical-align:middle" src="/faces/' + this.result + '.gif" alt="$&" />');
			});

			if(sText != sOri) jThis.html(sText);
		});
	}
},

'e24ec5f6-5734-4c2c-aa54-320ca29a3932':
{
	desc: '移除死圖',
	page: { 32: false },
	type: 6,
	defer: 1, // after all images are created
	once: function()
	{
		this.removeDead = function()
		{
			$(this).parent().css('text-decoration', 'none').html('<a href="javascript:" class="an-content-line">死圖已被移除</a>');
		};
	},
	infinite: function(jDoc, oFn)
	{
		jDoc.replies().jContents.find('img[onLoad]').each(function()
		{
			var sSrc = this.src;
			$(this).error(oFn.removeDead).attr('src', sSrc);
		});
	}
},

'd7adafa8-cc14-45f9-b3e9-bc36eab05d4f':
{
	desc: '縮小引用中的圖片',
	page: { 32: false },
	type: 6,
	options: { nQuoteImgMaxHeight: { desc: '圖片最大高度(px)', defaultValue: 100, type: 'text' } },
	once: function()
	{
		AN.util.stackStyle($.sprintf('.repliers_right blockquote img { max-height: %spx; }', AN.util.getOptions('nQuoteImgMaxHeight')));
	}
},

'8e1783cd-25d5-4b95-934c-48a650c5c042':
{
	desc: '屏蔽圖片 (點擊顯示)',
	page: { 32: false },
	type: 6,
	defer: 1, // after all images are created
	once: function(jDoc, oFn)
	{
		oFn.bAreMasked = true;

		AN.shared('addButton', '切換屏蔽圖片', function()
		{
			(oFn.bAreMasked = !oFn.bAreMasked) ? $('.an-maskimg').fadeOut().next().show() : $('.an-maskimg').next().hide().end().fadeIn();
		});

		this.unmaskIt = function()
		{
			var jBox = $(this).children('a');
			if(jBox.is(':visible'))
			{
				jBox.hide().prev().fadeIn();
				return false;
			}
		};
	},
	infinite: function(jDoc, oFn)
	{
		if(!this.bAreMasked) return;

		jDoc.replies().jContents.find('img[onLoad]').addClass('an-maskimg').hide().after('<a class="an-content-box" href="javascript:">點擊顯示圖片</a>').parent().css('text-decoration', 'none').click(oFn.unmaskIt);
	}
},

'e33bf00c-9fc5-46ab-866a-03c4c7ca5056':
{
	desc: '智能地將文字轉換成連結',
	page: { 32: true },
	type: 6,
	infinite: function(jDoc)
	{
		var rLink = /(?:ftp|https?):\/\/[\w.\/?:;~!@#$%^&*()+=-]+/i;
		var aMatch;

		var checkNode = function(nTarget)
		{
			if(nTarget.nextSibling) checkNode(nTarget.nextSibling);

			if(nTarget.nodeType == 3)
			{
				if(aMatch = rLink.exec(nTarget.data))
				{
					nTarget.splitText(RegExp.leftContext.length + aMatch[0].length);
					$(nTarget.splitText(RegExp.leftContext.length)).wrap($.sprintf('<a href="%s"></a>', aMatch[0])).parent().before('<span class="an-content-note" title="文字已轉換為連結">[L]</span>');
				}
			}
			else if(nTarget.firstChild && !$(nTarget).is('a,button,script,style'))
			{
				checkNode(nTarget.firstChild);
			}
		};

		jDoc.replies().jContents.each(function()
		{
			checkNode(this.firstChild);
		});
	}
},

'7b36188f-c566-46eb-b48d-5680a4331c1f':
{
	desc: '轉換論壇連結的伺服器位置',
	page: { 32: true },
	type: 6,
	infinite: function(jDoc)
	{
		var rForum = /forum\d*.hkgolden\.com/i;

		jDoc.replies().jContents.find('a').each(function()
		{
			var jThis = $(this);
			if(!jThis.children().length && rForum.test(this.hostname) && this.hostname != location.hostname)
			{
				jThis.attr('href', this.href.replace(rForum, location.hostname)).before('<span class="an-content-note" title="已轉換伺服器位置">[C]</span>');
			}
		});
	}
},

'8db8b611-e229-4d60-a74b-6142af1bacd8':
{
	desc: '提示可疑連結',
	page: { 32: false },
	type: 6,
	options:
	{
		sSusKey:
		{
			desc: '可疑關鍵字 [regular expression]',
			defaultValue: '[?&]r(?:ef(?:er[^=]+)?)?=|logout|tinyurl|urlpire|linkbucks|seriousurls|qvvo|viraldatabase|youfap|qkzone\\.com/t\\?',
			type: 'text'
		},
		sSusColor: { desc: '可疑關鍵字顏色', defaultValue: '#FF0000', type: 'text' }
	},
	infinite: function(jDoc, oFn)
	{
		var addBox = function()
		{
			AN.util.addStyle($.sprintf(' \
			#an-alertbox { display: none; position: absolute; border-width: 1px; } \
			#an-alertbox div { height: 2px; } \
			#an-alertbox p { margin: 0; padding: 0 0.2em; } \
			#an-alertbox span { color: %s; } \
			',
			AN.util.getOptions('sSusColor')
			));

			$('#an').append('<div id="an-alertbox" class="an-forum"><div class="an-forum-header"></div><p>發現可疑連結! keyword: <span></span></p></div>');

			oFn.showAlert = function(event)
			{
				$('#an-alertbox').find('span').text($(this).data('an-suskeyword'));
				$(document).bind('mousemove.an-alert', function(event)
				{
					var jAlert = $('#an-alertbox');
					jAlert.show().css({ top: event.pageY - jAlert.height() - 10, left: event.pageX - jAlert.width() / 2 });
				});
			};

			oFn.hideAlert = function()
			{
				$(document).unbind('.an-alert');
				$('#an-alertbox').fadeOut('fast');
			};
		};

		var rSus = RegExp(AN.util.getOptions('sSusKey'), 'i');
		var aMatch;

		jDoc.replies().jContents.find('a').each(function()
		{
			if(aMatch = rSus.exec(this.href))
			{
				if(!$('#an-alertbox').length) addBox();
				$(this).data('an-suskeyword', aMatch[0]).hover(oFn.showAlert, oFn.hideAlert);
			}
		});
	}
},

'039d820f-d3c7-4539-8647-dde974ceec0b':
{
	desc: '轉換視頻網站連結為影片',
	page: { 32: true },
	type: 6,
	defer: 2, // after layout is fixed
	options:
	{
		bConvertOnClick: { desc: '點擊連結才轉換', defaultValue: false, type: 'checkbox' }
	},
	once: function()
	{
		var aSites =
		[{
			regex: 'youtube\\.com/watch\\?',
			fn: function()
			{
				if(nWidth > 640) nWidth = 640;
				nHeight = nWidth / 16 * 9 + 25;
				sUrl = $.sprintf('http://www.youtube.com/v/%s&fs=1&rel=0&ap=%2526fmt%3D22', sUrl.replace(/.+?v=([^&]+).*/i, '$1'));
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

		this.rLink = (function()
		{
			var aReg = [];
			$.each(aSites, function(){ aReg.push(this.regex); });
			return new RegExp(aReg.join('|'), 'i');
		})();

		var nWidth, nHeight, sUrl;
		this.convert = function()
		{
			sUrl = this.href;
			nWidth = $(this).addClass('an-videolink').up('td,div').width();
			$.each(aSites, function()
			{
				if(RegExp(this.regex, 'i').test(sUrl))
				{
					this.fn();
					return false;
				}
			});

			$('<div></div>').insertAfter(this).toFlash(sUrl, { width: nWidth, height: nHeight.toFixed(0) }, { wmode: 'opaque', allowfullscreen: 'true' });
		};

		$('#ctl00_ContentPlaceHolder1_view_form').click(function(event)
		{
			var jTarget = $(event.target);
			if(!jTarget.is('.an-videolink')) return;
			event.preventDefault();
			jTarget.next().toggle();
		});

		var oFn = this;
		if(AN.util.getOptions('bConvertOnClick')) $('#ctl00_ContentPlaceHolder1_view_form').click(function(event)
		{
			var jTarget = $(event.target);
			if(!jTarget.is('a') || jTarget.is('.an-videolink') || !oFn.rLink.test(jTarget.attr('href'))) return;
			event.preventDefault();
			$($.sprintf('<iframe style="display: none" src="%s" />', jTarget.attr('href'))).appendTo('body').doTimeout(500, function(){ this.remove(); });
			oFn.convert.call(jTarget[0]);
		});
	},
	infinite: function(jDoc, oFn)
	{
		if(!AN.util.getOptions('bConvertOnClick')) jDoc.replies().jContents.find('a').filter(function(){ return oFn.rLink.test(this.href); }).each(oFn.convert);
	}
},

'd761d6f7-8ef7-4d5b-84e9-db16a274f616':
{
	desc: '轉換圖片連結為圖片',
	page: { 32: false },
	type: 6,
	infinite: function(jDoc)
	{
		jDoc.replies().jContents.find('a').each(function()
		{
			if(!$(this).children().length && /jpg|gif|png|bmp/i.test(this.href))
			{
				$(this).attr('target', '_blank').html($.sprintf('<img style="border-style: none" onLoad="DrawImage(this)" src="%s" alt="死圖" />', this.href, this.href)).before('<span class="an-content-note" title="已轉換連結為圖片">[P]</span>');
			}
		});
	}
},

'85950fa3-c5f0-4456-a81a-30a90ba6425c':
{
	desc: '顯示防盜鏈/域名被禁圖片 [FF: 建議改用RefControl] [暫時停用]',
	page: { 32: 'disabled'/* !$.browser.mozilla */ },
	type: 6,
	options: { sImgProxy: { desc: '圖片代理', defaultValue: 'http://www.pomo.cn/showpic.asp?url=', type: 'text' } },
	infinite: function(jDoc)
	{
		var sImgProxy = AN.util.getOptions('sImgProxy');

		jDoc.replies().jContents.find('img').each(function()
		{
			if(/imageshack\.us|hiphotos\.baidu\.com|\.tianya\.cn/i.test(this.src))
			{
				this.src = sImgProxy + encodeURIComponent(this.src);
			}
		});
	}
},

'ea19d7f6-9c2c-42de-b4f9-8cab40ccf544':
{
	desc: '限制回覆格高度',
	page: { 32: false },
	type: 6,
	defer: 2, // after layout is fixed
	options:
	{
		bAltScrollBarStyle: { desc: '將滾動條置於外層 [buggy w/ ajax fn@IE,FF,Chrome]', defaultValue: false, type: 'checkbox' },
		nMaxReplyHeight: { desc: '最大回覆高度(px)', defaultValue: 2000, type: 'text' }
	},
	once: function(jDoc)
	{
		if(AN.util.getOptions('bAltScrollBarStyle'))
		{
			var nWidth = jDoc.replies().jContents.eq(0).width();

			AN.util.stackStyle($.sprintf('\
			.repliers_right { overflow-x: visible; } \
			.an-replywrapper { overflow-y: auto; position: relative; z-index: 2; max-height: %spx; width: %spx; } \
			.an-replywrapper > div { padding-right: 1px; width: %spx; } \
			',
			AN.util.getOptions('nMaxReplyHeight'), nWidth + 30, nWidth));
		}
		else
		{
			AN.util.stackStyle($.sprintf('.an-replywrapper { overflow-y: auto; max-height: %spx; }', AN.util.getOptions('nMaxReplyHeight')));
		}
	},
	infinite: function(jDoc)
	{
		//jDoc.replies().jContents.wrapInner('<div class="an-replywrapper"></div>');
		jDoc.replies().jContents.wrapInner('<div class="an-replywrapper"><div></div></div>');
	}
},

'fc07ccda-4e76-4703-8388-81dac9427d7c':
{
	desc: '強制顯示空白用戶名連結',
	page: { 32: true },
	type: 6,
	infinite: function(jDoc)
	{
		jDoc.replies().each(function()
		{
			if(/^\s*$/.test($(this).data('sUserName')))
			{
				$(this).data('jNameLink').html('<span style="color: black">&lt;空白名稱&gt;</span>');
			}
		});
	}
},

'e19a8d96-151f-4f86-acfc-0af12b53b99b':
{
	desc: '快速3擊左鍵關閉頁面 [FF: 只能配合連結開新頁使用]',
	page: { 32: false },
	type: 6,
	once: function()
	{
		var down = 0;
		var reset = function(){ down = 0; };

		$(document).mousedown(function(event)
		{
			if(down === 0) setTimeout(reset, 500);

			if(++down == 3)
			{
				window.opener = window;
				window.open('', '_parent');
				window.close();
			}
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
	once: function(jDoc, oFn)
	{
		var aFilter = AN.util.data('aTopicFilter') || [];
		var jCurTarget;
		var jButton= $($.sprintf('\
			<span style="display: none; position: absolute; text-align: center; background-color: %(sMainHeaderBgColor)s; color: %(sMainHeaderFontColor)s; cursor: pointer;">X</span> \
			', AN.util.getOptions()))
			.appendTo('#an')
			.click(function()
			{
				addFilter(jCurTarget.find('a:first').html().replace(/<img[^>]+?alt="([^"]+)[^>]*>/ig, '$1'));
			});

		$(document).mouseover(function(event)
		{
			var jTarget = $(event.target);
			if(jTarget[0] == jButton[0]) return;

			jTarget = jTarget.closest('#HotTopics tr');
			if(jTarget.length && !jTarget.is(':first-child'))
			{
				jCurTarget = jTarget;
				var offset = jTarget.offset();
				var jImgCell = jTarget.children(':first');
				var nHeight = jImgCell.outerHeight();
				jButton.css({ top: offset.top, left: offset.left, width: jImgCell.outerWidth() + 1, height: nHeight, lineHeight: nHeight + 'px' }).show();
			}
			else
			{
				jButton.hide();
			}
		});

		var addFilter = function(sTopicName)
		{
			var sFilter = prompt('請輸入過濾器', sTopicName || '');
			if(!sFilter) return;

			aFilter.push(sFilter);
			AN.util.data('aTopicFilter', aFilter);
			oFn.filterTopics();
		};

		this.filterTopics = function(jScope)
		{
			if(!aFilter.length) return;

			var nCount = 0;
			(jScope || $(document)).topics().each(function()
			{
				var jThis = $(this);
				var sTitle = jThis.data('sTitle');
				$.each(aFilter, function(i, sFilter)
				{
					if(sTitle.indexOf(sFilter) != -1)
					{
						nCount++;
						jThis.hide();
						return false;
					}
				});
			});

			if(nCount) AN.shared('log', $.sprintf('%s個標題已被過濾', nCount));
		};

		if(AN.util.getOptions('bAddFilterButton')) AN.shared('addButton', '新增過濾器', addFilter);

		if(AN.util.getOptions('bFilterListButton')) AN.shared('addButton', '標題過濾列表', function()
		{
			if(!$('#an-filterlist').length)
			{
				AN.util.addStyle($.sprintf('\
				#an-filterlist > ul { margin: 5px; } \
				#an-filterlist > ul > li { padding: 2px 0; } \
				#an-filterlist > ul > li > span { margin-right: 5px; border: 1px solid black; padding: 0 5px; background-color: %(sMainHeaderBgColor)s; color: %(sMainHeaderFontColor)s; cursor: pointer; } \
				',
				AN.util.getOptions()
				));

				AN.shared.box('an-filterlist', '標題過濾列表', 500);

				$('#an-filterlist').click(function(event)
				{
					var jTarget = $(event.target);
					if(!jTarget.is('span')) return;

					var sFilter = jTarget.next().html();

					var nIndex = $.inArray(sFilter, aFilter);
					if(nIndex != -1) aFilter.splice(nIndex, 1);

					AN.util.data('aTopicFilter', aFilter);
					jTarget.parent().remove();
				});
			}

			var sHTML = '';
			if(aFilter.length)
			{
				$.each(aFilter, function(i, sFilter)
				{
					sHTML += $.sprintf('<li><span>X</span>%s</li>', sFilter);
				});
			}
			else
			{
				sHTML += '<li>沒有任何過濾器</li>';
			}

			$('#an-filterlist').html('<ul>' + sHTML + '</ul>');

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
	desc: '用戶屏敝功能',
	page: { 32: true },
	type: 6,
	once: function(jDoc, oFn)
	{
		var aBamList = AN.util.data('aBamList') || [];
		var jCurTarget;
		var jButton= $($.sprintf('\
			<span style="display: none; position: absolute; padding: 2px 5px; background-color: %(sMainHeaderBgColor)s; color: %(sMainHeaderFontColor)s; cursor: pointer;">X</span> \
			', AN.util.getOptions()))
			.appendTo('#an')
			.click(function()
			{
				var sUserId = jCurTarget.find('a:first').attr('href').replace(/.+?userid=(\d+).*/, '$1');

				var nIndex = $.inArray(sUserId, aBamList);
				nIndex == -1 ? aBamList.push(sUserId) : aBamList.splice(nIndex, 1);

				AN.util.data('aBamList', aBamList);
				oFn.toggleReplies(null, sUserId, nIndex == -1);
			});

		$(document).mouseover(function(event)
		{
			var jTarget = $(event.target);
			if(jTarget[0] == jButton[0]) return;

			jTarget = jTarget.closest('.repliers_left');
			if(jTarget.length)
			{
				jCurTarget = jTarget;
				var offset = jTarget.offset();
				jButton.css({ top: offset.top, left: offset.left }).show();
			}
			else
			{
				jButton.hide();
			}
		});

		AN.util.stackStyle('\
		.an-bammed { opacity: 0.5; filter: alpha(opacity=50); } \
		.an-bammed .repliers_left > table > tbody > tr:first-child ~ tr, .an-bammed .repliers_right > tbody > tr:first-child { display: none; } \
		');

		this.toggleReplies = function(jScope)
		{
			(jScope || $(document)).replies().each(function()
			{
				var jThis = $(this);
				jThis.toggleClass('an-bammed', $.inArray(jThis.data('sUserid'), aBamList) != -1);
			});
		};
	},
	infinite: function(jDoc)
	{
		this.toggleReplies(jDoc);
	}
},

'a7484cf2-9cbd-47aa-ac28-472f55a1b8f4':
{
	desc: '需要時自動加入代碼插入按扭',
	page: { 288: true },
	type: 6,
	once: function()
	{
		var jTextarea, rUrl, jUrlBtn, rImg, jImgBtn, text, match;

		$('#ctl00_ContentPlaceHolder1_messagetext').bind('keyup mouseup change', function()
		{
			if(!jTextarea)
			{
				jTextarea = $(this);

				rUrl = /(?:https?|ftp):\/\/(?:[\w-]+\.)+[a-z]{2,3}(?:\/[\w-_.!~*'();,\/?:@&=+$]*)?(?![\w-_.!~*'();,\/?:@&=+$]|\s*\[\/(?:img|url)])/gi;
				jUrlBtn = $('<button type="button" style="vertical-align: top; margin-left: 5px; display: none;" />').insertAfter('#ctl00_ContentPlaceHolder1_btn_Submit').click(function()
				{
					jTextarea.val(text.replace(rUrl, '[url]$&[/url]'));
					jUrlBtn.hide();
				});

				rImg = /http:\/\/(?:[\w-]+\.)+[a-z]{2,3}\/[\w-_.!~*'();,\/?:@&=+$]+?\.(?:jpg|png|gif)(?![\w-_.!~*'();,\/?:@&=+$]|\s*\[\/(?:img|url)])/gi;
				jImgBtn = $('<button type="button" style="vertical-align: top; margin-left: 5px; display: none;" />').insertAfter(jUrlBtn).click(function()
				{
					jTextarea.val(text.replace(rImg, '[img]$&[/img]'));
					jImgBtn.hide();
				});
			}

			text = jTextarea.val();
			(match = text.match(rUrl)) ? jUrlBtn.html($.sprintf('為%s個連結加上[url]代碼', match.length)).show() : jUrlBtn.hide();
			(match = text.match(rImg)) ? jImgBtn.html($.sprintf('為%s個圖片連結加上[img]代碼', match.length)).show() : jImgBtn.hide();
		});
	}
},

'74cd7f38-b0ad-4fca-ab39-673b0e2ee4c7':
{
	desc: '修正跳頁控件位置',
	page: { 32: true },
	type: 3,
	once: function()
	{
		AN.util.stackStyle($.sprintf('div[style^="%s: center"] { margin: 0 100px; }', $.browser.msie ? 'TEXT-ALIGN' : 'text-align'));
	}
},

'7f9780a6-395d-4b24-a0a8-dc58c4539408':
{
	desc: '改進字型大小/顏色插入控件',
	page: { 288: true },
	type: 4,
	once: function()
	{
		$('#ctl00_ContentPlaceHolder1_QuickReplyTable select[onchange]').change(function()
		{
			this.selectedIndex = 0;
		});
	}
},

'1fb17624-7c6f-43aa-af11-9331f1f948cb':
{
	desc: '強化表情圖示列',
	page: { 288: true },
	type: 6,
	once: function()
	{
		if(!$('#ctl00_ContentPlaceHolder1_messagetext').length) return;

		var jSmileyTr = $('#ctl00_ContentPlaceHolder1_messagetext').up('tr').next();
		if(jSmileyTr.nextAll().length > 1) jSmileyTr.nextAll(':not(:last)').hide();

		// jQuery('#TABLE_ID').outer().replace(/>\s+</g, '><').replace(/&nbsp;\s+/g, '&nbsp;').replace(/'/g,'\\\'');

		var smileys = [
			{
				desc: '特殊圖示',
				html: {
					path: 'faces',
					table: [
						[
							['#good2#', 'ThumbUp'],
							['#bad#', 'ThumbDown'],
							['[img]/faces/surprise2.gif[/img]', 'surprise2'],
							['[img]/faces/beer.gif[/img]', 'beer']
						]
					]
				}
			},
			{
				desc: '聖誕表情圖示',
				html: '<table style="display: none;" cellpadding="0" cellspacing="0"><tbody><tr><td colspan="2"><a href="javascript:InsertText(\'[O:-)x]\',false)"><img style="border-width: 0px;" src="faces/xmas/angel.gif" alt="[O:-)x]"></a>&nbsp;<a href="javascript:InsertText(\'[xx(x]\',false)"><img style="border-width: 0px;" src="faces/xmas/dead.gif" alt="[xx(x]"></a>&nbsp;<a href="javascript:InsertText(\'[:)x]\',false)"><img style="border-width: 0px;" src="faces/xmas/smile.gif" alt="[:)x]"></a>&nbsp;<a href="javascript:InsertText(\'[:o)x]\',false)"><img style="border-width: 0px;" src="faces/xmas/clown.gif" alt="[:o)x]"></a>&nbsp;<a href="javascript:InsertText(\'[:o)jx]\',false)"><img style="border-width: 0px;" src="faces/xmas/clown_jesus.gif" alt="[:o)jx]"></a>&nbsp;<a href="javascript:InsertText(\'[:-(x]\',false)"><img style="border-width: 0px;" src="faces/xmas/frown.gif" alt="[:-(x]"></a>&nbsp;<a href="javascript:InsertText(\'[:~(x]\',false)"><img style="border-width: 0px;" src="faces/xmas/cry.gif" alt="[:~(x]"></a>&nbsp;<a href="javascript:InsertText(\'[;-)x]\',false)"><img style="border-width: 0px;" src="faces/xmas/wink.gif" alt="[;-)x]"></a>&nbsp;<a href="javascript:InsertText(\'[:-[x]\',false)"><img style="border-width: 0px;" src="faces/xmas/angry.gif" alt="[:-[x]"></a>&nbsp;<a href="javascript:InsertText(\'[:-]x]\',false)"><img style="border-width: 0px;" src="faces/xmas/devil.gif" alt="[:-]x]"></a>&nbsp;<a href="javascript:InsertText(\'[:Dx]\',false)"><img style="border-width: 0px;" src="faces/xmas/biggrin.gif" alt="[:Dx]"></a>&nbsp;<a href="javascript:InsertText(\'[:Ox]\',false)"><img style="border-width: 0px;" src="faces/xmas/oh.gif" alt="[:Ox]"></a>&nbsp;<a href="javascript:InsertText(\'[:Px]\',false)"><img style="border-width: 0px;" src="faces/xmas/tongue.gif" alt="[:Px]"></a>&nbsp;<a href="javascript:InsertText(\'[^3^x]\',false)"><img style="border-width: 0px;" src="faces/xmas/kiss.gif" alt="[^3^x]"></a>&nbsp;<a href="javascript:InsertText(\'[?_?x]\',false)"><img style="border-width: 0px;" src="faces/xmas/wonder.gif" alt="[?_?x]"></a>&nbsp;<a href="javascript:InsertText(\'#yupx#\',false)"><img style="border-width: 0px;" src="faces/xmas/agree.gif" alt="#yupx#"></a>&nbsp;<a href="javascript:InsertText(\'#ngx#\',false)"><img style="border-width: 0px;" src="faces/xmas/donno.gif" alt="#ngx#"></a>&nbsp;<a href="javascript:InsertText(\'#hehex#\',false)"><img style="border-width: 0px;" src="faces/xmas/hehe.gif" alt="#hehex#"></a>&nbsp;<a href="javascript:InsertText(\'#lovex#\',false)"><img style="border-width: 0px;" src="faces/xmas/love.gif" alt="#lovex#"></a>&nbsp;<a href="javascript:InsertText(\'#ohx#\',false)"><img style="border-width: 0px;" src="faces/xmas/surprise.gif" alt="#ohx#"></a>&nbsp;</td></tr><tr><td><a href="javascript:InsertText(\'#assx#\',false)"><img style="border-width: 0px;" src="faces/xmas/ass.gif" alt="#assx#"></a>&nbsp;<a href="javascript:InsertText(\'[sosadx]\',false)"><img style="border-width: 0px;" src="faces/xmas/sosad.gif" alt="[sosadx]"></a>&nbsp;<a href="javascript:InsertText(\'#goodx#\',false)"><img style="border-width: 0px;" src="faces/xmas/good.gif" alt="#goodx#"></a>&nbsp;<a href="javascript:InsertText(\'#hohox#\',false)"><img style="border-width: 0px;" src="faces/xmas/hoho.gif" alt="#hohox#"></a>&nbsp;<a href="javascript:InsertText(\'#killx#\',false)"><img style="border-width: 0px;" src="faces/xmas/kill.gif" alt="#killx#"></a>&nbsp;<a href="javascript:InsertText(\'#byex#\',false)"><img style="border-width: 0px;" src="faces/xmas/bye.gif" alt="#byex#"></a>&nbsp;<a href="javascript:InsertText(\'[Z_Zx]\',false)"><img style="border-width: 0px;" src="faces/xmas/z.gif" alt="[Z_Zx]"></a>&nbsp;<a href="javascript:InsertText(\'[@_@x]\',false)"><img style="border-width: 0px;" src="faces/xmas/@.gif" alt="[@_@x]"></a>&nbsp;<a href="javascript:InsertText(\'#adorex#\',false)"><img style="border-width: 0px;" src="faces/xmas/adore.gif" alt="#adorex#"></a>&nbsp;<a href="javascript:InsertText(\'#adore2x#\',false)"><img style="border-width: 0px;" src="faces/xmas/adore2.gif" alt="#adore2x#"></a>&nbsp;<a href="javascript:InsertText(\'[???x]\',false)"><img style="border-width: 0px;" src="faces/xmas/wonder2.gif" alt="[???x]"></a>&nbsp;<a href="javascript:InsertText(\'[bangheadx]\',false)"><img style="border-width: 0px;" src="faces/xmas/banghead.gif" alt="[bangheadx]"></a>&nbsp;<a href="javascript:InsertText(\'[bouncerx]\',false)"><img style="border-width: 0px;" src="faces/xmas/bouncer.gif" alt="[bouncerx]"></a>&nbsp;</td><td rowspan="2" valign="bottom"><a href="javascript:InsertText(\'[offtopicx]\',false)"><img style="border-width: 0px;" src="faces/xmas/offtopic.gif" alt="[offtopicx]"></a>&nbsp;</td></tr><tr><td><a href="javascript:InsertText(\'[censoredx]\',false)"><img style="border-width: 0px;" src="faces/xmas/censored.gif" alt="[censoredx]"></a>&nbsp;<a href="javascript:InsertText(\'[flowerfacex]\',false)"><img style="border-width: 0px;" src="faces/xmas/flowerface.gif" alt="[flowerfacex]"></a>&nbsp;<a href="javascript:InsertText(\'[shockingx]\',false)"><img style="border-width: 0px;" src="faces/xmas/shocking.gif" alt="[shockingx]"></a>&nbsp;<a href="javascript:InsertText(\'[photox]\',false)"><img style="border-width: 0px;" src="faces/xmas/photo.gif" alt="[photox]"></a>&nbsp;<a href="javascript:InsertText(\'[yipesx]\',false)"><img style="border-width: 0px;" src="faces/xmas/yipes.gif" alt="[yipesx]"></a>&nbsp;<a href="javascript:InsertText(\'[yipes2x]\',false)"><img style="border-width: 0px;" src="faces/xmas/yipes2.gif" alt="[yipes2x]"></a>&nbsp;<a href="javascript:InsertText(\'[yipes3x]\',false)"><img style="border-width: 0px;" src="faces/xmas/yipes3.gif" alt="[yipes3x]"></a>&nbsp;<a href="javascript:InsertText(\'[yipes4x]\',false)"><img style="border-width: 0px;" src="faces/xmas/yipes4.gif" alt="[yipes4x]"></a>&nbsp;<a href="javascript:InsertText(\'[369x]\',false)"><img style="border-width: 0px;" src="faces/xmas/369.gif" alt="[369x]"></a>&nbsp;<a href="javascript:InsertText(\'[bombx]\',false)"><img style="border-width: 0px;" src="faces/xmas/bomb.gif" alt="[bombx]"></a>&nbsp;<a href="javascript:InsertText(\'[slickx]\',false)"><img style="border-width: 0px;" src="faces/xmas/slick.gif" alt="[slickx]"></a>&nbsp;<a href="javascript:InsertText(\'[fuckx]\',false)"><img style="border-width: 0px;" src="faces/xmas/diu.gif" alt="[fuckx]"></a>&nbsp;<a href="javascript:InsertText(\'#nox#\',false)"><img style="border-width: 0px;" src="faces/xmas/no.gif" alt="#nox#"></a>&nbsp;<a href="javascript:InsertText(\'#kill2x#\',false)"><img style="border-width: 0px;" src="faces/xmas/kill2.gif" alt="#kill2x#"></a>&nbsp;</td></tr><tr><td><a href="javascript:InsertText(\'#kill3x#\',false)"><img style="border-width: 0px;" src="faces/xmas/kill3.gif" alt="#kill3x#"></a>&nbsp;<a href="javascript:InsertText(\'#cnx#\',false)"><img style="border-width: 0px;" src="faces/xmas/chicken.gif" alt="#cnx#"></a>&nbsp;<a href="javascript:InsertText(\'#cn2x#\',false)"><img style="border-width: 0px;" src="faces/xmas/chicken2.gif" alt="#cn2x#"></a>&nbsp;<a href="javascript:InsertText(\'[bouncyx]\',false)"><img style="border-width: 0px;" src="faces/xmas/bouncy.gif" alt="[bouncyx]"></a>&nbsp;<a href="javascript:InsertText(\'[bouncy2x]\',false)"><img style="border-width: 0px;" src="faces/xmas/bouncy2.gif" alt="[bouncy2x]"></a>&nbsp;<a href="javascript:InsertText(\'#firex#\',false)"><img style="border-width: 0px;" src="faces/xmas/fire.gif" alt="#firex#"></a>&nbsp;</td></tr></tbody></table>'
			},
			{
				desc: '綠帽表情圖示',
				html: {
					path: 'faces/xmas/green',
					table: [
						[
							['[:)gx]', 'smile'],
							['[:o)gx]', 'clown'],
							['[:-(gx]', 'frown'],
							['[:~(gx]', 'cry'],
							['#yupgx#', 'agree']
						],
						[
							['[sosadgx]', 'sosad'],
							['#goodgx#', 'good'],
							['#byegx#', 'bye']
						],
						[
							['[369gx]', '369'],
							['[fuckgx]', 'diu']
						]
					]
				}
			},
			{
				desc: '新年表情圖示',
				html: {
					path: 'faces/newyear',
					table: [
						[
							['[:o)n]', 'clown'],
							['[:o)2n]', 'clown2'],
							['[:o)3n]', 'clown3']
						],
						[
							['[sosadn]', 'sosad'],
							['[sosad2n]', 'sosad2'],
							['[sosad3n]', 'sosad3'],
							['[bangheadn]', 'banghead'],
							['[banghead2n]', 'banghead2'],
							['[bouncern]', 'bouncer']
						],
						[
							['[yipesn]', 'yipes'],
							['[369n]', '369'],
							['[3692n]', '3692'],
							['[fuckn]', 'diu']
						]
					],
					span: [
							['#assn#', 'ass'],
						['[offtopicn]', 'offtopic'],
						['[offtopic2n]', 'offtopic2']
					]
				}
			},
			{
				desc: '腦魔表情圖示',
				html: '<table style="display: none;" cellpadding="0" cellspacing="0"><tbody><tr><td><a href="javascript:InsertText(\'[:-[lm]\',false)"><img style="border-width: 0px;" src="faces/lomore/angry.gif" alt="[:-[lm]"></a>&nbsp;<a href="javascript:InsertText(\'[:Dlm]\',false)"><img style="border-width: 0px;" src="faces/lomore/biggrin.gif" alt="[:Dlm]"></a>&nbsp;<a href="javascript:InsertText(\'[:Olm]\',false)"><img style="border-width: 0px;" src="faces/lomore/oh.gif" alt="[:Olm]"></a>&nbsp;<a href="javascript:InsertText(\'[:Plm]\',false)"><img style="border-width: 0px;" src="faces/lomore/tongue.gif" alt="[:Plm]"></a>&nbsp;<a href="javascript:InsertText(\'#lovelm#\',false)"><img style="border-width: 0px;" src="faces/lomore/love.gif" alt="#lovelm#"></a>&nbsp;<a href="javascript:InsertText(\'#goodlm#\',false)"><img style="border-width: 0px;" src="faces/lomore/good.gif" alt="#goodlm#"></a>&nbsp;<a href="javascript:InsertText(\'#hoholm#\',false)"><img style="border-width: 0px;" src="faces/lomore/hoho.gif" alt="#hoholm#"></a>&nbsp;<a href="javascript:InsertText(\'#killlm#\',false)"><img style="border-width: 0px;" src="faces/lomore/kill.gif" alt="#killlm#"></a>&nbsp;<a href="javascript:InsertText(\'[???lm]\',false)"><img style="border-width: 0px;" src="faces/lomore/wonder2.gif" alt="[???lm]"></a>&nbsp;<a href="javascript:InsertText(\'[flowerfacelm]\',false)"><img style="border-width: 0px;" src="faces/lomore/flowerface.gif" alt="[flowerfacelm]"></a>&nbsp;<a href="javascript:InsertText(\'[shockinglm]\',false)"><img style="border-width: 0px;" src="faces/lomore/shocking.gif" alt="[shockinglm]"></a>&nbsp;<a href="javascript:InsertText(\'[yipeslm]\',false)"><img style="border-width: 0px;" src="faces/lomore/yipes.gif" alt="[yipeslm]"></a>&nbsp;<a href="javascript:InsertText(\'[offtopiclm]\',false)"><img style="border-width: 0px;" src="faces/lomore/offtopic.gif" alt="[offtopiclm]"></a>&nbsp;</td></tr><tr><td><a href="javascript:InsertText(\'[369lm]\',false)"><img style="border-width: 0px;" src="faces/lomore/369.gif" alt="[369lm]"></a>&nbsp;<a href="javascript:InsertText(\'[@_@lm]\',false)"><img style="border-width: 0px;" src="faces/lomore/@.gif" alt="[@_@lm]"></a>&nbsp;<a href="javascript:InsertText(\'#hehelm#\',false)"><img style="border-width: 0px;" src="faces/lomore/hehe.gif" alt="#hehelm#"></a>&nbsp;<a href="javascript:InsertText(\'[fucklm]\',false)"><img style="border-width: 0px;" src="faces/lomore/diu.gif" alt="[fucklm]"></a>&nbsp;<a href="javascript:InsertText(\'[bouncerlm]\',false)"><img style="border-width: 0px;" src="faces/lomore/bouncer.gif" alt="[bouncerlm]"></a>&nbsp;</td></tr></tbody></table>'
			},
			{
				desc: 'SARS表情圖示',
				html: {
					path: 'faces/sick',
					table: [
						[
							['[O:-)sk]', 'angel'],
							['[:o)sk]', 'clown'],
							['[:-[sk]', 'angry'],
							['[:-]sk]', 'devil'],
							['#yupsk#', 'agree'],
							['#ngsk#', 'donno'],
							['#cnsk#', 'chicken']
						],
						[
							['#asssk#', 'ass'],
							['[sosadsk]', 'sosad'],
							['#hohosk#', 'hoho'],
							['#hoho2sk#', 'hoho2'],
							['#killsk#', 'kill'],
							['#byesk#', 'bye'],
							['[@_@sk]', '@'],
							['#adoresk# ', 'adore'],
							['[bangheadsk]', 'banghead']
						],
						[
							['[flowerfacesk]', 'flowerface'],
							['[shockingsk]', 'shocking'],
							['[photosk]', 'photo'],
							['#firesk#', 'fire'],
							['[369sk]', '369'],
							['[fucksk]', 'diu']
						]
					]
				}
			}
		];
		
		function buildTable(data)
		{
			function writeLink(smileyNo, smiley)
			{
				tableHTML += $.sprintf(
					'<a href="javascript:InsertText(\'%(code)s\',false)"><img style="border: 0" src="%(path)s/%(filename)s.gif" alt="%(code)s" /></a>&nbsp;',
					{ code: smiley[0], path: data.path, filename: smiley[1] }
				);
			}
			
			var tableHTML = '<table style="display: none" cellpadding="0" cellspacing="0"><tbody>';
			
			$.each(data.table, function(rowNo, row)
			{
				tableHTML += '<tr>';
				
				tableHTML += rowNo == 0 ? '<td colspan="2">' : '<td>';
				$.each(row, writeLink);
				tableHTML += '</td>';
				
				if(rowNo == 1 && data.span)
				{
					tableHTML += '<td valign="bottom" rowspan="2">';
					$.each(data.span, writeLink);
					tableHTML += '</td>';
				}
				
				tableHTML += '</tr>';
			});
			
			tableHTML += '</tbody></table>';

			return tableHTML;
		}

		var selectHTML = '<select><option>經典表情圖示</option>';
		$.each(smileys, function()
		{
			selectHTML += '<option>' + this.desc + '</option>';
			jSmileyTr.children(':last').append(typeof this.html == 'string' ? this.html : buildTable(this.html));
		});
		selectHTML += '</select>';

		$(selectHTML).change(function()
		{
			jSmileyTr.children(':last').children().hide().eq(this.selectedIndex).show();
		}).appendTo(jSmileyTr.children(':first').empty()).after(':');
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
					#an-snippets > ul { float: left; } \
					#an-snippets > ul > li { padding: 2px 0; } \
					#an-snippets > ul > li > span { margin-right: 5px; border: 1px solid black; padding: 0 5px; background-color: %(sMainHeaderBgColor)s; color: %(sMainHeaderFontColor)s; cursor: pointer; } \
					#an-snippets > div { float: right; margin-left: 10px; padding-left: 10px; text-align: center; border-left: 1px solid gray; } \
					#an-snippets > div > textarea { display: block; width: 400px; height: 300px; } \
					',
					AN.util.getOptions()
					));
					
					var index, jDesc, jContent;
					jSnippets = AN.shared.box('an-snippets', '自訂文字', 700).append('<ul></ul><div><input /><textarea></textarea><button type="button">ok</button><button type="button">cancel</button></div>').click(function(event)
					{
						var jTarget = $(event.target);
						if(!jTarget.is('span,button')) return;
						
						var type = jTarget.text();
						if(type == 'cancel') {
							jSnippets.children('div').css('opacity', '0.5').children().attr('disabled', true);
						}
						else if(type == 'E' || type == '+') {
							// index = jTarget.parent().index(); // cant use this due to a problem with FF+GM
							var testElem = jTarget.parent().parent().children()[0];
							index = 0;
							while(testElem != jTarget.parent()[0]) {
								testElem = testElem.nextSibling;
								index++;
							}
							jDesc.val(type == 'E' ? snippets[index][0] : '').next().val(type == 'E' ? snippets[index][1] : '').parent().css('opacity', '1').children().attr('disabled', false);
						}
						else
						{
							if(type == 'ok') {
								snippets.push([jDesc.val(), jContent.val()]);
							}
							else if(type == 'X' && confirm('確定移除?')) {
								snippets.splice(index, 1);
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