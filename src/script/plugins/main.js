$.extend(an.plugins, {

'b6b232c8-1f26-449e-bb0d-2b7826bf95ef':
{
	desc: '去除論壇原有的圖片縮小功能',
	page: { 32: on, 192: on },
	type: 4,
	queue: [{
		fn: function(job)
		{
			window.DrawImage = $.noop;

			$.ss('\
			.repliers_right a[target] { display: inline-block; max-width: 100% } \
			.repliers_right img[onload] { width: auto; height: auto; max-width: 100% } \
			.repliers_right > tbody > tr:first-child a[target]:focus { outline: 0; } \
			');
		}
	}]
},

'd7adafa8-cc14-45f9-b3e9-bc36eab05d4f':
{
	desc: '縮小引用中的圖片',
	page: { 32: off },
	type: 4,
	options: { nQuoteImgMaxHeight: { desc: '圖片最大高度(px)', defaultValue: 100, type: 'text' } },
	queue: [{
		fn: function(job)
		{
			$.ss('.repliers_right blockquote img[onload] { width: auto; height: auto; max-height: {0}px; }', job.options('nQuoteImgMaxHeight'));
		}
	}]
},

'52ebe3d3-bf98-44d2-a101-180ec69ce290':
{
	desc: '移除帖子連結高亮部份',
	page: { 64: off },
	type: 4,
	queue: [{
		fn: function(job)
		{
			var regex = /&highlight_id=\d+/;
			$d.mouseover(function(event)
			{
				var jTarget = $(event.target);
				if(!(jTarget.is('a') && regex.test(jTarget.attr('href')))) return;

				jTarget.attr('href', jTarget.attr('href').replace(regex, ''));
			});
		}
	}]
},

'87a6307e-f5c2-405c-8614-af60c85b101e':
{
	desc: '搜尋開新頁',
	page: { 4: off, 24: off },
	type: 4,
	queue: [{
		fn: function(job)
		{
			window.Search = function()
			{
				var
				type = $('#st').val(),
				query = escape($('#searchstring').val());

				window.open(type == 'tag' ? 'tags.aspx?tagword='.concat(query) : $.format('search.aspx?st={0}&searchstring={1}', type, query), '_blank');

				$('#searchstring').val('');
			};
		}
	}]
},

'a93f1149-d11b-4b72-98dd-c461fd9ee754':
{
	desc: '連結開新頁',
	page: { 4: off, 24: off, 64: off },
	type: 4,
	options: { bTopicLinksOnly: { desc: '只限帖子連結', defaultValue: false, type: 'checkbox' } },
	queue: [{
		fn: function(job)
		{
			$.live('a', 'click', function(event)
			{
				if(!event.isDefaultPrevented() && $(this).attrFilter('href',  job.options('bTopicLinksOnly') && /view\.aspx/, /^#|^javascript|topics\.aspx/).length) {
					event.preventDefault();
					window.open(this.href, '_blank');
				}
			});
		}
	}]
},

'2ab2f404-0d35-466f-98a5-c88fdbdaa031':
{
	desc: '外鏈連結開新頁',
	page: { 32: on },
	type: 4,
	queue: [{
		fn: function(job)
		{
			$.live('a', 'click', function(event)
			{
				if(!event.isDefaultPrevented() && $(this).is('.repliers_right > tbody > tr:first-child a')) {
					event.preventDefault();
					window.open(this.href, '_blank');
				}
			});
		}
	}]
},

'b73d2968-8301-4c5e-8700-a89541d274fc':
{
	desc: '回復傳統用戶連結',
	page: { 32: off },
	type: 4,
	queue: [{
		fn: function(job)
		{
			$.live('a', 'mouseover', function()
			{
				if(this.href.indexOf('ToggleUserDetail') !== -1) {
					this.href = '/ProfilePage.aspx?userid=' + $(this).up('tr').attr('userid');
				}
			});
		}
	}]
},

'6e978310-e87b-4043-9def-076a13377c19':
{
	desc: '更換favicon(小丑icon) [部份瀏覽器無效]',
	page: { 65534: off },
	type: 4,
	queue: [{
		fn: function(job)
		{
			$('<link>', { rel: 'shortcut icon', href: 'http://helianthus-annuus.googlecode.com/svn/other/hkg.ico' }).appendTo('head');
		}
	}]
},

'e54d5c5f-47ae-4839-b4e8-6fc3733edfef':
{
	desc: '改進公司模式',
	page: { 65534: on },
	type: 4,
	options:
	{
		sCModeFavicon: { desc: 'favicon連結位置 [部份瀏覽器無效]', defaultValue: 'http://www.google.com/favicon.ico', type: 'text' },
		sCModeTitle: { desc: '標題名稱', defaultValue: 'Google', type: 'text' }
	},
	queue: [{
		fn: function(job)
		{
			if($.cookie('companymode') == 'Y') {
				$('<link>', { rel: 'shortcut icon', href: job.options('sCModeFavicon') }).appendTo('head');
				document.title = job.options('sCModeTitle');
			}
		}
	}]
},

// 加入物件 //
'231825ad-aada-4f5f-8adc-5c2762c1b0e5':
{
	desc: '顯示資料: 樓主名稱',
	page: { 32: off },
	type: 5,
	queue: [{
		fn: function(job)
		{
			$.openerInfo(function(info)
			{
				$.run('addInfo', $.format('樓主: <a target="_blank" href="/ProfilePage.aspx?userid={0}">{1}</a>', info.userid, info.username));
			});
		}
	}]
},

'9e181e79-153b-44d5-a482-5ccc6496a172':
{
	desc: '顯示資料: 累計在線時間',
	page: { 65534: off },
	type: 5,
	queue: [{
		fn: function(job)
		{
			var nLastOnTime = job.db('nLastOnTime');
			var nCumulatedTime = job.db('nCumulatedTime') || 0;

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

			$.run('addInfo', '在線時間: ' + sCumulated);

			job.db('nLastOnTime', $.time());
			job.db('nCumulatedTime', nCumulatedTime);
		}
	}]
},

'f47e77c8-6f1a-43b2-8493-f43de222b3b4':
{
	desc: '加入伺服器狀態顯示按扭',
	page: { 65534: on },
	type: 5,
	queue: [{
		fn: function(job)
		{
			$.run('addButton', '伺服器狀態', $.serverTable);
		}
	}]
},

'7de28ca9-9c44-4949-ad4a-31f38a984715':
{
	desc: '加入一鍵留名按扭',
	page: { 32: off },
	type: 5,
	options: { sLeaveNameMsg: { desc: '回覆內容', defaultValue: '留名', type: 'text' } },
	queue: [{
		fn: function(job)
		{
			if(!$.isLoggedIn()) return;

			$.run('addButton', '一鍵留名', function()
			{
				$('#ctl00_ContentPlaceHolder1_messagetext').val(job.options('sLeaveNameMsg'));
				$('#aspnetForm').submit();
			});
		}
	}]
},

'69260bc4-4f43-4dda-ba0f-87ba804a866c':
{
	desc: '加入同步登入所有server的按扭',
	page: { 65534: off },
	type: 5,
	queue: [{
		fn: function(job)
		{
			$.run('addButton', '登入所有server', function()
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
						alert($.format('登入完成!{0}\n\n點擊確定重新整理頁面.', aLeft.length ? $.format('\n\n伺服器{0}登入失敗!', aLeft.join(',')) : ''));
						location.reload();
					}
				};

				var login = function(nForum)
				{
					if(!this.contentWindow.document.getElementById('aspnetForm')) // error page
					{
						$.run('log', $.format('伺服器{0}登入失敗!', nForum));
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

						$.run('log', $.format('伺服器{0}登入成功!', nForum));
						complete();
					});
				};

				$.run('log', '登入各伺服器中, 請稍候...');

				$.each(aLeft, function(i, nForum)
				{
					$('<iframe style="display: none;"></iframe>')
					.appendTo('#an')
					.attr('src', $.format('http://forum{0}.hkgolden.com/login.aspx', nForum))
					.load(function()
					{
						login.call(this, nForum);
					})
					.error(function()
					{
						$.run('log', $.format('伺服器{0}登入失敗!', nForum));
						complete();
					});
				});

				setTimeout(function(){ complete(true); }, 10000);
			});
		}
	}]
},

'13c276a5-f84e-4f53-9ada-45545ccc6b2e':
{
	desc: '加入同步登出所有server的按扭',
	page: { 65534: off },
	type: 5,
	queue: [{
		fn: function(job)
		{
			$.run('addButton', '登出所有server', function()
			{
				if(!confirm('確定登出所有server?')) return;

				var nServer = 8;

				var aLeft = [];
				for(var i=1; i<=nServer; i++)	aLeft.push(i);

				var complete = function(bForce)
				{
					if(aLeft.length === 0 || bForce)
					{
						alert($.format('登出完成!{0}\n\n點擊確定重新整理頁面.', aLeft.length ? $.format('\n\n伺服器{0}登出失敗!', aLeft.join(',')) : ''));
						location.reload();
					}
				};

				$.run('log', '登出各伺服器中, 請稍候...');

				$.each(aLeft, function(i, nForum)
				{
					$($.format('<img src="http://forum{0}.hkgolden.com/logout.aspx" />', nForum))
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

						$.run('log', $.format('伺服器{0}登出完成!', nForum));
						complete();
					});
				});

				setTimeout(function(){ complete(true); }, 10000);
			});
		}
	}]
},

'aad1f3ac-e70c-4878-a1ef-678539ca7ee4':
{
	desc: '加入前往吹水台的快速連結',
	page: { 65534: on },
	type: 5,
	queue: [{
		fn: function(job)
		{
			$.run('addLink', '吹水台', '/topics.aspx?type=BW', 1);
		}
	}]
},

'd0d76204-4033-4bd6-a9a8-3afbb807495f':
{
	desc: '加入前往最頂/底的按扭',
	page: { 32: on },
	type: 5,
	queue: [{
		fn: function(job)
		{
			$.run('addLink', '最頂', function(){ document.body.scrollIntoView(); }, 0);
			$.run('addLink', '最底', function(){ document.body.scrollIntoView(false); }, 2);
		}
	}]
},

'b78810a2-9022-43fb-9a9b-f776100dc1df':
{
	desc: '加入樓層編號',
	page: { 32: on },
	type: 5,
	queue: [{
		type: 2,
		fn: function(job)
		{
			var nCurPageNo = $j.ajaxPageNo();
			var nFloor = ((nCurPageNo == 1) ? 0 : 25 * (nCurPageNo - 1) + 1) + $j.pageRoot().find('.an-content-floor').length;

			$j.replies().find('span:last').append(function(i){ return $.format(' <span class="an-content-floor an-content-box">#{0}</span>', nFloor + i); });
		}
	}]
},


// 其他功能 //
'3f693a9e-e79d-4d14-b639-a57bee36079a':
{
	desc: '自動顯示伺服器狀態檢查視窗',
	page: { 1: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.run('serverTable');
		}
	}]
},

'4cdce143-74a5-4bdb-abca-0351638816fa':
{
	desc: '發表新帖子的主旨過長時進行提示',
	page: { 256: on },
	type: 6,
	queue: [{
		fn: function(job)
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
	}]
},

'86d24fc8-476a-4de3-95e1-5e0eb02b3353':
{
	desc: '轉換表情碼為圖片',
	page: { 92: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var codes = [];
			job.plugin.smileys = {};

			$.each(an.smileys, function(i, typeSet)
			{
				$.each(typeSet.table, function(j, row)
				{
					$.each(row, function(k, cell)
					{
						$.each(cell, function(l, smileySet)
						{
							job.plugin.smileys[smileySet[0]] = typeSet.path + smileySet[1];
							codes.push(smileySet[0].replace(/[[\]()?]/g, '\\$&'));
						});
					});
				});
			});

			job.plugin.rCodes = new RegExp(codes.join('|'), "g");
		}
	},
	{
		type: 2,
		fn: function(job)
		{
			$j.topics().each(function()
			{
				var
				jTitle = $(this).find('a:first'),
				oldTitle = jTitle.text(),
				newTitle = oldTitle.replace(job.plugin.rCodes, function($0){ return '<img src="'+job.plugin.smileys[$0]+'.gif" alt="'+$0+'" />'; });

				if(oldTitle !== newTitle) jTitle.html(newTitle);
			});
		}
	}]
},

'b69c5067-2726-43f8-b3de-dfb907355b71':
{
	desc: '標題過濾功能',
	page: { 4: on },
	type: 6,
	options:
	{
		bFilterListButton: { desc: '加入標題過濾列表按扭', defaultValue: true, type: 'checkbox' },
		bAddFilterButton: { desc: '加入新增過濾器按扭', defauleValue: false, type: 'checkbox' }
	},
	queue: [{
		fn: function(job)
		{
			var aFilter = job.db('aTopicFilter') || [],
			jHiddenImg,
			jButton = $('<img />', { src: an.resources['cross-shield'], css: { 'margin-left': '-1.5px' } }).hoverize('#HotTopics tr:not(:first-child)', { autoPosition: false })
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
					addFilter(jButton.data('hoverize').jTarget.find('a:first').html().replace(/<img[^>]+?alt="?([^" ]+)[^>]*>/ig, '$1'));
				}
			});

			var addFilter = function(sTopicName)
			{
				var sFilter = prompt('請輸入過濾器', sTopicName || '');
				if(!sFilter) return;

				aFilter.push(sFilter);
				job.db('aTopicFilter', aFilter);
				filterTopics();
			};

			var filterTopics = this.filterTopics = function(jScope)
			{
				if(!aFilter.length) return;

				var nCount = 0;
				(jScope || $d).topics().each(function()
				{
					var jThis = $(this);
					var sTitle = jThis.find('a:first').html().replace(/<img[^>]+?alt="?([^" ]+)[^>]*>/ig, '$1');
					$.each(aFilter, function(i, sFilter)
					{
						if(sTitle.indexOf(sFilter) !== -1) {
							nCount++;
							jThis.hide();
							return false;
						}
					});
				});

				if(nCount) $.run('log', $.format('{0}個標題已被過濾', nCount));
			};

			if(job.options('bAddFilterButton')) $.run('addButton', '新增過濾器', addFilter);

			if(job.options('bFilterListButton')) $.run('addButton', '標題過濾列表', function() {
				if(!$('#an-filterlist').length) {
					$.ss('\
					#an-filterlist > ul { margin: 5px; } \
					#an-filterlist > ul > li { padding: 2px 0; } \
					#an-filterlist > ul > li > span:first-child { margin-right: 5px; border: 1px solid black; padding: 0 5px; background-color: {0.sMainHeaderBgColor}; color: {0.sMainHeaderFontColor}; cursor: pointer; } \
					',
					job.options()
					);

					$.box('an-filterlist', '標題過濾列表', 500);

					$('#an-filterlist').click(function(event)
					{
						var jTarget = $(event.target);
						if(!jTarget.is('span:first-child')) return;

						var sFilter = jTarget.next().html();

						var nIndex = $.inArray(sFilter, aFilter);
						if(nIndex != -1) aFilter.splice(nIndex, 1);

						job.db('aTopicFilter', aFilter);
						jTarget.parent().remove();
					});
				}

				var sHTML = '';
				if(aFilter.length) {
					$.each(aFilter, function(i, sFilter)
					{
						sHTML += $.format('<li><span>X</span><span>{0}</span></li>', sFilter);
					});
				}
				else {
					sHTML += '<li>沒有任何過濾器</li>';
				}

				$('#an-filterlist').html('<ul>' + sHTML + '</ul>');

				$.gray(true, 'an-filterlist');
			});

			$.prioritize(2, function()
			{
				filterTopics($j);
			});
		}
	}]
},

'db770fdc-9bf5-46b9-b3fa-78807f242c3c':
{
	desc: '用戶封鎖功能',
	page: { 32: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.ss('\
			.an-bammed-msg { color: #999; font-size: 10px; text-align: center; } \
			.an-bammed-msg > span { cursor: pointer; } \
			.an-bammed > td { opacity: 0.5; } \
			.an-bammed > .repliers_left > div > a:first-child ~ *, .an-bammed > td > .repliers_right { display: none; } \
			');

			var bamList = job.db('aBamList') || [],

			jButton = $.userButton().bind({
				click: function()
				{
					var userid = jButton.data('userButton').jTarget.attr('userid');
					var index = $.inArray(userid, bamList);
					index === -1 ? bamList.push(userid) : bamList.splice(index, 1);

					job.db('aBamList', bamList);
					toggleReplies(null);
				},
				buttonshow: function()
				{
					var isBammed = $.inArray(jButton.data('userButton').jTarget.attr('userid'), bamList) !== -1;
					jButton.attr('src', an.resources[isBammed ? 'tick-shield' : 'cross-shield']).siblings().toggle(!isBammed);
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

			var toggleReplies = function(jScope)
			{
				(jScope || $(document)).replies().jInfos.each(function()
				{
					var jThis = $(this);
					jThis.toggleClass('an-bammed', $.inArray(jThis.attr('userid'), bamList) != -1);
				});
			};

			$.prioritize(2, function()
			{
				if(bamList.length) filterTopics($j);
			});
		}
	}]
},

'7906be8e-1809-40c1-8e27-96df3aa229d8':
{
	desc: '用戶高亮功能',
	page: { 32: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var highlightList = $.bbq.getState('highlight_id') || window.highlight_id && [window.highlight_id + ''] || [],

			jButton = $.userButton().bind({
				click: function()
				{
					var userid = jButton.data('userButton').jTarget.attr('userid');
					var index = $.inArray(userid, highlightList);
					index === -1 ? highlightList.push(userid) : highlightList.splice(index, 1);

					$.bbq.pushState({ highlight_id: highlightList });

					toggleReplies(null);
				},
				buttonshow: function()
				{
					jButton.attr('src', an.resources[jButton.data('userButton').jTarget.hasClass('an-highlighted') ? 'highlighter--minus': 'highlighter--plus']);
				}
			});

			$.ss('\
			tr[userid] > td { background-color: {0.sSecBgColor} !important; } \
			tr.an-highlighted > td { background-color: {0.sHighlightBgColor} !important; } \
			',
			job.options());

			var toggleReplies = function(jScope)
			{
				(jScope || $(document)).replies().jInfos.each(function()
				{
					var jThis = $(this);
					jThis.toggleClass('an-highlighted', $.inArray(jThis.attr('userid'), highlightList) != -1);
				});
			};

			$.prioritize(2, function()
			{
				if(highlightList.length) toggleReplies($j);
			});
		}
	}]
},

'e82aa0ba-aa34-4277-99ea-41219dcdacf2':
{
	desc: '用戶單獨顯示功能',
	page: { 32: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var
			targetId,
			jButton = $.userButton().bind({
				click: function()
				{
					targetId = targetId ? null : jButton.data('userButton').jTarget.attr('userid');
					toggleReplies(null);
				},
				buttonshow: function()
				{
					jButton.attr('src', an.resources[targetId ? 'magnifier-zoom-out' : 'magnifier-zoom-in']);
				}
			}),
			toggleReplies = function(jScope)
			{
				(jScope || $(document)).replies().jInfos.each(function()
				{
					var jThis = $(this);
					jThis.closest('div > table').toggle(!targetId || jThis.attr('userid') === targetId);
				});
			};

			$.prioritize(2, function()
			{
				if(targetId) toggleReplies($j);
			});
		}
	}]
},

'fc07ccda-4e76-4703-8388-81dac9427d7c':
{
	desc: '強制顯示空白用戶名連結',
	page: { 32: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.ss('.an-nameforcedshown:before { content: "<空白名稱>"; font-style: italic; }');
		}
	},
	{
		type: 2,
		fn: function(job)
		{
			$j.replies().jNameLinks.filter(function(){ return $(this).width() === 0; }).addClass('an-nameforcedshown');
		}
	}]
},

'63333a86-1916-45c1-96e0-f34a5add67c1':
{
	desc: '限制回覆高度',
	page: { 32: off },
	type: 6,
	options: {
		replyMaxHeight: { desc: '最大高度(px)', type: 'text', defaultValue: 2000 }
	},
	queue: [{
		fn: function(job)
		{
			var maxHeight = job.options('replyMaxHeight');

			$.ss('\
			.repliers_right, .repliers_right > tbody, .repliers_right > tbody > tr, .repliers_right > tbody > tr > td { display: block; } \
			.repliers_right > tbody > tr:first-child { max-height: '+maxHeight+'px; overflow-y: hidden; } \
			.an-maxheightremoved > .repliers_right > tbody > tr:first-child { max-height: none; } \
			#an-heighttoggler { margin: -14px 0 0 3.5px; } \
			#an-heighttoggler > img { padding: 7px 3.5px; cursor: pointer; } \
			');

			var jButton = $('<div id="an-heighttoggler"><img src="'+an.resources['control-eject']+'" /><img src="'+an.resources['control-stop-270']+'" /><img src="'+an.resources['control-270']+'" /></div>')
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
	}]
},

'7b36188f-c566-46eb-b48d-5680a4331c1f':
{
	desc: '轉換論壇連結的伺服器位置',
	page: { 32: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var rForum = /forum\d*.hkgolden\.com/i;
			$d.mousedown(function(event)
			{
				var jTarget = $(event.target);
				if(!( jTarget.is('.repliers_right > tbody > tr:first-child a') && rForum.test(jTarget.attr('href')) )) return;

				jTarget.attr('href', jTarget.attr('href').replace(rForum, location.hostname));
			});
		}
	}]
},

'e33bf00c-9fc5-46ab-866a-03c4c7ca5056':
{
	desc: '轉換文字連結成連結',
	page: { 32: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.ss('.an-linkified { padding: 0 2px; }');
		}
	},
	{
		type: 2,
		fn: function(job)
		{
			var
			rLink = /(?:https?|ftp):\/\/(?:[\w-]+\.)+[a-z]{2,3}(?![a-z])(?:\/[\w.\/?:;~!@#$%^&*()+=-]*)?/i,
			rSkip = /^(?:a|button|script|style)$/i;

			$j.replies().jContents.each(function()
			{
				if(rLink.test($(this).text())) {
					var node, match, next = this.firstChild;
					while(node = next) {
						if(node.nodeType === 3 && (match = rLink.exec(node.data))) {
							node.splitText(match.index + match[0].length);

							$(node.splitText(match.index))
							.before('<img title="已轉換文字為連結" class="an-linkified" src="'+an.resources['chain--arrow']+'" />')
							.wrap($.format('<a href="{0}"></a>', match[0]));

							node = node.nextSibling.nextSibling;
						}

						next = !rSkip.test(node.nodeName) && node.firstChild || node.nextSibling;
						while(!next && (node = node.parentNode)) {
							if(node === this) break;
							next = node.nextSibling;
						}
					}
				}
			});
		}
	}]
},

'422fe323-e61e-47d9-a348-d40011f5da28':
{
	desc: '連結封鎖功能',
	page: { 32: off },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.ss('\
			.repliers_right a[target] { display: inline-block; } \
			a[href].an-linkblocked { text-decoration: line-through; font-style: italic; cursor: default; } \
			a[target].an-linkblocked:before { content: attr(rel); } \
			a[target].an-linkblocked > img { display: none; } \
			#an-linkblocktoggler { margin: -16px 0 0 -34px; padding: 16px; padding-right: 2px; } \
			');

			var
			blockList = job.db('linkBlockList') || [],
			rInternal = /^http:\/\/(?:[^.]+.)hkgolden\.com/,

			jButton = $('<img />', { id: 'an-linkblocktoggler' })
			.hoverize('.repliers_right > tbody > tr:first-child a', {
				filter: function(){ return $(this).hasClass('an-linkblocked') || !rInternal.test(this.href); },
				fixScroll: 'top'
			})
			.bind({
				entertarget: function()
				{
					jButton.attr('src', an.resources[jButton.data('hoverize').jTarget.hasClass('an-linkblocked') ? 'tick-shield' : 'cross-shield']);
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

					job.db('linkBlockList', blockList);
				}
			});

			$.prioritize(2, function()
			{
				$j.replies().jContents.find('a').filter(function(){ return $.inArray(this.href, blockList) !== -1; }).toggleClass('an-linkblocked').each(function()
				{
					$(this).attr({ href: 'javascript:', rel: this.href });
				});
			});
		}
	}]
},

'd761d6f7-8ef7-4d5b-84e9-db16a274f616':
{
	desc: '轉換圖片連結成圖片',
	page: { 32: off },
	type: 6,
	options: {
		imageConvertMode: { desc: '轉換模式', type: 'select', choices: ['自動轉換', '自動轉換(引用中的連結除外)', '手動轉換'], defaultValue: '自動轉換(引用中的連結除外)' }
	},
	queue: [{
		fn: function(job)
		{
			$.ss('\
			.an-imagified { padding: 0 2px; } \
			.an-imagified + a[href] { display: block; } \
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

					jTarget.after($.format(
					'<img title="已轉換連結為圖片" class="an-imagified" src="{0}" /><a href="{1}" target="_blank"><img onload="DrawImage(this)" src="{1}" alt="[img]{1}[/img]" /></a>',
					an.resources['image-export'], event.target.href));
				}
			});

			var convertMode = $.inArray(job.options('imageConvertMode'), job.plugin.options.imageConvertMode.choices);
			if(convertMode !== 2) $.prioritize(2, function()
			{
				$j.replies().jContents.find(convertMode === 0 ? 'a' : 'a:not(blockquote a)').trigger('imageconvert');
			});
		}
	}]
},

'8e1783cd-25d5-4b95-934c-48a650c5c042':
{
	desc: '圖片屏蔽功能',
	page: { 32: off },
	type: 6,
	options: {
		imageMaskMode: { desc: '屏蔽模式', type: 'select', choices: ['自動屏蔽', '自動屏蔽(只限引用中的圖片)', '手動屏蔽'], defaultValue: '自動屏蔽(只限引用中的圖片)' }
	},
	queue: [{
		fn: function(job)
		{
			var maskMode = $.inArray(job.options('imageMaskMode'), job.plugin.options.imageMaskMode.choices);
			var selector = {
				0: '.repliers_right img[onload],',
				1: '.repliers_right blockquote img[onload],',
				2: ''
			}[maskMode];

			$.ss(selector + 'img[onload].an-maskedImage { padding: 52px 48px 0 0; width: 0; height: 0; background: url('+an.resources['gnome-mime-image-bmp']+') no-repeat; }');

			if(maskMode !== 2) {
				$.ss('img[src][onload].an-unmaskedImage { padding: 0; width: auto; height: auto; background: none; }');
			}

			var jButton = $('<img />', { src: an.resources['picture--minus'], css: { 'margin-top': '-2px' } })
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
	}]
},

'039d820f-d3c7-4539-8647-dde974ceec0b':
{
	desc: '轉換視頻網站連結成影片',
	page: { 32: on },
	type: 6,
	options: {
		videoConvertMode: { desc: '轉換模式', type: 'select', choices: ['自動轉換', '自動轉換(引用中的連結除外)', '手動轉換'], defaultValue: '自動轉換(引用中的連結除外)' }
	},
	queue: [{
		fn: function(job)
		{
			var nWidth, nHeight, sUrl;
			var aSites =
			[{
				regex: 'youtube\\.com/watch\\?v=',
				fn: function(job)
				{
					if(nWidth > 640) nWidth = 640;
					nHeight = nWidth / 16 * 9 + 25;
					sUrl = $.format('http://www.youtube.com/v/{0}&fs=1&rel=0', sUrl.replace(/.+?v=([^&]+).*/i, '$1'));
				}
			},
			{
				regex: 'vimeo\\.com/\\d',
				fn: function(job)
				{
					if(nWidth > 504) nWidth = 504;
					nHeight = nWidth / 1.5;
					sUrl = $.format('http://vimeo.com/moogaloop.swf?clip_id={0}&show_title=1&fullscreen=1', sUrl.replace(/.+vimeo\.com\/(\d+).*/i, '$1'));
				}
			},
			{
				regex: 'youku\\.com/v_show/',
				fn: function(job)
				{
					if(nWidth > 480) nWidth = 480;
					nHeight = nWidth / 4 * 3 + 40;
					sUrl = $.format('http://player.youku.com/player.php/sid/{0}/v.swf', sUrl.replace(/.+?id_([^\/]+).*/i, '$1'));
				}
			},
			{
				regex: 'tudou\\.com/programs/',
				fn: function(job)
				{
					if(nWidth > 420) nWidth = 420;
					nHeight = nWidth / 4 * 3 + 48;
					sUrl = $.format('http://www.tudou.com/v/{0}', sUrl.replace(/.+?view\/([^\/]+).*/i, '$1'));
				}
			}];
			var rLink = (function()
			{
				var aReg = [];
				$.each(aSites, function(){ aReg.push(this.regex); });
				return new RegExp(aReg.join('|'), 'i');
			})();

			$.ss('\
			.an-videoified { padding: 0 2px; } \
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
					.before('<img title="已轉換連結為影片" class="an-videoified" src="'+an.resources['film--arrow']+'" />');
				}
			});

			var convertMode =  $.inArray(job.options('videoConvertMode'), job.plugin.options.videoConvertMode.choices);
			if(convertMode !== 2) $.prioritize(2, function()
			{
				$j.replies().jContents.find(convertMode === 0 ? 'a' : 'a:not(blockquote a)').trigger('videoconvert');
			});
		}
	}]
},

'a7484cf2-9cbd-47aa-ac28-472f55a1b8f4':
{
	desc: '需要時自動加入代碼插入按扭',
	page: { 288: on },
	type: 6,
	queue: [{
		fn: function(job)
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

					rUrl = new RegExp($.format('{0.host}(?:/(?:(?!{0.codes})\\S)*)?(?!(\\S*?| *)\\[/(?:img|url)])', parts), 'gi');
					jUrlBtn = $('<button type="button" style="vertical-align: top; margin-left: 5px; display: none;" />').insertAfter('#ctl00_ContentPlaceHolder1_btn_Submit').click(function()
					{
						jTextarea.val(text.replace(rUrl, '[url]$&[/url]')).change();
					});

					rImg = new RegExp($.format('{0.host}/(?:(?!{0.codes})\\S)+?\\.(?:bmp|jpe?g|png|gif)(?! *\\[/(?:img|url)])', parts), 'gi');
					jImgBtn = $('<button type="button" style="vertical-align: top; margin-left: 5px; display: none;" />').insertAfter(jUrlBtn).click(function()
					{
						jTextarea.val(text.replace(rImg, '[img]$&[/img]')).change();
					});
				}

				text = jTextarea.val();
				(match = text.match(rUrl)) ? jUrlBtn.html($.format('為{0}個連結加上[url]代碼', match.length)).show() : jUrlBtn.hide();
				(match = text.match(rImg)) ? jImgBtn.html($.format('為{0}個圖片連結加上[img]代碼', match.length)).show() : jImgBtn.hide();
			});
		}
	}]
},

'1fb17624-7c6f-43aa-af11-9331f1f948cb':
{
	desc: '強化表情圖示列',
	page: { 288: on },
	type: 6,
	options: { sSmileySelectMethod: { desc: '圖示選擇方式', defaultValue: '列表', type: 'select', choices: ['列表', '連結'] } },
	queue: [{
		fn: function(job)
		{
			// jQuery('#TABLE_ID').outerhtml().replace(/>\s+</g, '><').replace(/&nbsp;\s+/g, '&nbsp;').replace(/'/g,'\\\'');
			if(!$('#ctl00_ContentPlaceHolder1_messagetext').length) return;

			var selector = '#ctl00_ContentPlaceHolder1_QuickReplyTable table table > tbody > tr:first-child + tr + tr + tr';
			if($('#ctl00_ContentPlaceHolder1_Forum_Type_Row').length) selector += '+ tr + tr';
			selector += '> td:first-child';

			$.ss('\
			'+selector+' { cursor: pointer; } \
			'+selector+':before { content: url('+an.resources['smiley-twist']+'); margin-right: 2px; vertical-align: middle; } \
			');

			$d.bind('click.smileyadder', function(event)
			{
				var jSmileyTr = $('#ctl00_ContentPlaceHolder1_messagetext').up('tr').next();

				if(jSmileyTr.length && jSmileyTr.children(':first')[0] !== event.target) return;

				$d.unbind('click.smileyadder');

				$.ss('\
				'+selector+' { cursor: default; } \
				'+selector+':before { content: ""; display: none; } \
				');

				jSmileyTr.children(':last').append(function()
				{
					var html = '';
					$.each(an.smileys, function(i, typeSet)
					{
						if(i === 0) return;

						html += '<table style="display: none" cellpadding="0" cellspacing="0"><tbody>';
						$.each(typeSet.table, function(rowNo, row)
						{
							html += '<tr>';
							$.each(row, function(cellNo, cell)
							{
								html += cellNo === 1 ? '<td valign="bottom" rowspan="2">' : typeSet.table[rowNo + 1] && typeSet.table[rowNo + 1][1] ? '<td colspan="2">' : '<td>';
								$.each(cell, function(i, smileySet)
								{
									html += $.format(
										'<a href="javascript:InsertText(\'{0.code}\',false)"><img src="{0.path}{0.filename}.gif" alt="{0.code}" /></a>&nbsp;',
										{ path: typeSet.path, code: smileySet[0], filename: smileySet[1] }
									);
								});
								html += '</td>';
							});
							html += '</tr>';
						});

						html += '</tbody></table>';
					});
					return html;
				});

				var isSelectMode = job.options('sSmileySelectMethod') === '列表';

				if(!isSelectMode) $.ss('#an-smileyselector { list-style: none; margin: 0; padding: 0; font-size: 80%; }');

				$((function()
				{
					var
					innerhtml = isSelectMode ? '<option>{0}</option>' : '<li><a href="javascript:">{0}</a></li>',
					html = isSelectMode ? '<select>' : '<ul id="an-smileyselector">';
					$.each(an.smileys, function()
					{
						html += $.format(innerhtml, this.desc);
					});
					html += isSelectMode ? '</select>' : '</ul>';

					return html;
				})())
				.bind(isSelectMode ? 'change' : 'click', function(event)
				{
					jSmileyTr.children(':last').children().hide().eq(isSelectMode ? this.selectedIndex : $(event.target).parent().index()).show();
				})
				.appendTo(jSmileyTr.children(':first').empty());
			});
		}
	}]
},

'e336d377-bec0-4d88-b6f8-52e122f4d1c9':
{
	desc: '加入自訂文字插入控件',
	page: { 288: on },
	type: 5,
	queue: [{
		fn: function(job)
		{
			if(!$('#ctl00_ContentPlaceHolder1_messagetext').length) return;

			var snippets = job.db('snippets') || [
				['家姐潮文', '講起我就扯火啦\n我家姐一路都在太古廣場一間名店做sales\n間店有好多有錢人同名人幫襯\n做了很多年，已經是senior\n咁多年黎都好俾心機做，經理亦好 like佢\n因為收入不錯又隱定，家姐原本諗住同拍拖多年既bf結婚\n咁多年黎我家姐好少俾人投訴\n而且同好多大客既關係都唔錯\n前排關心研去過我家姐間店幫襯\n不過serve佢既不是我家姐，但佢一買就買左好多野\n過左個幾星期，佢又再去間店行\n上次serve果個Day-off, 咁我家姐就頂上serve佢\n開頭已經好有禮貌介紹d新貨俾佢, 仲話俾折頭佢\n佢就無乜反應，望一望另一堆客\n果堆客係大陸人，三至四個，講野好大聲\n關小姐就同我家姐講話可唔可以關左間鋪一陣\n等佢揀衫\n 我家姐同我講，佢公司一向唔俾佢地咁做\n驚做壞個頭，除非真係有乜大人物，好多記者好混亂先可以咁做\n但佢見到關小姐黑口黑面，都識做話打電話去問一問老闆\n老闆梗係話唔得啦，至多俾多d折頭她\n咁關小姐就發老脾，鬧到我家姐一面屁\nd說話勁難聽，又話自己買野既錢多過我家姐搵幾年既錢\n我家姐都唔敢得罪佢，一味道歉\n跟住關小姐就走左人，家姐就同老闆備案\n老闆瞭解左情況就無再追問\n過左兩日佢接到老闆電話話收到complaint \n話有人投訴佢態度唔好，唔理顧客感受\n公司policy一向唔話俾佢地知係邊次事件\n我家姐估黎估去都淨係得失過關小姐一人\n總之俾老闆話左兩句\n又過幾日，關小姐又黎\n這次和件西裝友一齊，但好在成店都無其他客\n我家姐怕又惹事，叫左個junior過去serve佢\n點知條老西友係要點番我家姐serve.\n根住關小姐就玩野，試衫，但話d衫俾其他人試過污糟\n要開新衫試，我家姐雖然知公司唔俾咁做，\n但怕左佢，唯有照做\n點知試左兩三件，件件佢都要咁試又無話要\n我家姐終於話唔好意思，其實唔可以咁做\n(根本明知她玩野啦.....)\n又係至多俾多d折頭佢\n跟住佢件西裝友就鬧我家姐話"係咪話我地無錢買你地d野?"\n我家姐話唔係，但佢照鬧\n鬧左十幾分鐘\nd同事見咁幫手，又照鬧\n最終打俾老闆備案\n之後連收兩封warning letter\n早兩日接埋大信封\n年尾俾人炒左']
			];
			var jSelect = $('<select></select>');

			function writeSelect()
			{
				var selectHTML = '<option>自訂文字</option>';
				$.each(snippets, function(textNo)
				{
					selectHTML += $.format('<option value="{0}">{1}</option>', textNo, this[0]);
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
						$.ss('\
						#an-snippets { padding: 5px; } \
						#an-snippets > ul { float: left; } \
						#an-snippets > ul > li { padding: 2px 0; } \
						#an-snippets > ul > li > span { margin-right: 5px; border: 1px solid black; padding: 0 5px; background-color: {0.sMainHeaderBgColor}; color: {0.sMainHeaderFontColor}; cursor: pointer; } \
						#an-snippets > div { float: right; margin-left: 10px; padding-left: 10px; text-align: center; border-left: 1px solid gray; } \
						#an-snippets > div > textarea { display: block; width: 400px; height: 300px; } \
						',
						job.options()
						);

						var index, editing, jDesc, jContent;
						jSnippets = $.box('an-snippets', '自訂文字', 700)
						.append('<ul></ul><div><input /><textarea></textarea><button type="button">ok</button><button type="button">cancel</button></div>')
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
								job.db('snippets', snippets);
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
					$.gray(true, 'an-snippets');
				}
				else {
					window.InsertText(snippets[this.value][1], false);
				}

				this.selectedIndex = 0;
			});
		}
	}]
}

});