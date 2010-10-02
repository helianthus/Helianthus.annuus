annuus.add({
	id: '7fbb4647-7c1f-4b1f-a8d5-c1c95a709c03',
	title: '標籤式瀏覽',
	pages: { on: [all] },
	requires: ['ajax', 'notice'],
	tasks: {
		'9f145953-c630-4d6c-b5c4-bf5a480b8570': {
			option: { title: '關閉瀏覽進程前先進行確認', defaultValue: true },
			condition: {
				page: topics,
				test: !window.frameElement
			},
			run_at: 'document_start',
			js: function()
			{
				$(window).bind('beforeunload', function()
				{
					return '請確認是否關閉瀏覽進程.';
				});
			}
		},

		'44982093-2dbe-4c2c-ae2a-53acdaeeb4ec': {
			type: 'service',
			name: 'tabs',
			condition: {
				page: topics,
				test: !window.frameElement
			},
			run_at: 'document_start',

			api: {
				open: {},
				close: {},
				select: {},
				tabReady: {},
				widget: {}
			},

			init: function(self)
			{
				$.rules('\
					html { overflow: hidden; } \
					#an-tabs-overlay { position: fixed; z-index: 500; width: 100%; height: 100%; } \
					#an-tabs-overlay > div { position: relative; top: 50%; margin-top: -1em; line-height: 2em; font-size: 2em; text-align: center; } \
					#an-tabs-overlay > div > img:first-child { vertical-align: text-bottom; } \
					#an-tabs-overlay > div > img + img { margin-left: 0.1em; } \
					#an-tabs-frames > iframe { display: none; position: fixed; width: 100%; height: 100%; border: 0; } \
				');

				$($.format('\
					<div id="an-tabs"> \
						<div id="an-tabs-overlay" class="an-content-background"><div><img src="{0.master-switch}"/>loading...<img src="{0.throbber}"/></div></div> \
						<div id="an-tabs-frames"></div> \
					</div> \
				',
				self.data('images')))
				.appendTo('#annuus');

				self.frames = $('#an-tabs-frames');

				self.open({
					url: $.url({ querySet: { tabs: 1 } }),
					notify: false,
					ready: function(tab)
					{
						self.select(tab);
						$('#an-tabs-overlay').fadeOut(1000);

						bolanderi.ready('window_end', function()
						{
							$('#bolanderi').siblings().add('#an-button, #an-master').remove();
						});
					}
				});
			},

			getTab: function(self, param)
			{
				return self.tabs[
					param.id
					|| typeof param === 'object' && $.data(param.frameElement || param[0] || param, 'an-tabs-id')
					|| param
				];
			},

			update: function(self, tab)
			{
				if(tab.isReady) {
					var win = tab.frame[0].contentWindow;
					tab.url = win.location.href;
					tab.title = win.document.title.replace(/ - 香港高登討論區/, '');
				}

				var urlSet = tab.urlSet = $.urlSet(tab.url);

				tab.label = (function()
				{
					switch(tab.urlSet.file.toLowerCase()) {
						case 'blog.aspx': return $.format('博客: {0}', tab.isReady ? '{2}(userid: {1})' : '{1}', urlSet.querySet.userid, tab.isReady && tab.frame.contents().find('#ctl00_ContentPlaceHolder1_lb_nickname').text());
						case 'profilepage.aspx': return $.format('會員資料: {0}', tab.isReady ? '{2}(userid: {1})' : '{1}', urlSet.querySet.userid, tab.isReady && tab.frame.contents().find('#ctl00_ContentPlaceHolder1_tc_Profile_tb0_lb_nickname').text());
						case 'search.aspx': return $.format('搜尋: {0}', urlSet.querySet.searchstring);
						case 'topics.aspx': return self.data('channel')[urlSet.querySet.type || 'BW'];
						default: return tab.isReady ? win.document.title.replace(/ - 香港高登討論區/, '') : tab.url;
					}
				})();
			},

			tabReady: function(self, tab)
			{
				if(tab = self.getTab(tab)) {
					tab.isReady = true;
					self.update(tab);

					if(tab.ready) {
						tab.ready(tab);
						delete tab.ready;
					}

					if(tab.notice) {
						var notice = annuus.api('notice');

						notice.remove(tab.notice);

						tab.notice = notice.add({
							icon: 'check',
							header: '載入完成',
							content: tab.label || tab.title,
							controls: '<a data-an-notice="open">開啟</a><a data-an-notice="replace">取代</a><a data-an-notice="close">關閉</a></div>'
						})
						.delegate('a', 'click', function()
						{
							var type = $(this).data('an-notice');
							self[type === 'close' ? 'close' : 'select'](tab, type === 'replace');
						});
					}

					if(tab.id === 1 && tab.url !== tab.frame[0].src) {
						(self.tabs[tab.id = ++self.guid] = tab).frame.data('an-tabs-id', tab.id);

						self.open({
							id: 1,
							notify: false,
							url: tab.frame[0].src
						});

						$.log('warn', 'URL of main tab is changed, auto fixing by re-opening the main tab.');
					}
				}
			},

			tabs: {},
			guid: 0,

			pageData: {
				'profilepage.aspx': { unique: 'userid', paged: false },
				'topics.aspx': { unique: 'type', paged: true },
				'view.aspx': { unique: 'message', paged: true }
			},

			open: function(self, options)
			{
				var urlSet = $.urlSet(options.url);
				var tabId;

				var pageData = self.pageData[urlSet.file.toLowerCase()];
				tabId = $.first(self.tabs, function(tabId, tab)
				{
					var set = tab.urlSet;

					if(urlSet.absolute === set.absolute
					|| pageData
					&& urlSet.file === set.file
					&& urlSet.querySet[pageData.unique] === set.querySet[pageData.unique]
					&& (!pageData.paged || (urlSet.querySet.page || 1) == (set.querySet.page || 1))
					) {
						if(tab.isReady) {
							self.select(tabId, true)
						}
						return tabId;
					}
				});

				if(!tabId) {
					tabId = options.id = +options.id || ++self.guid;

					options = $.extend({
						notify: true,
					}, options);

					self.update(options);

					self.tabs[tabId] = $.extend(options, {
						notice: options.notify && annuus.api('notice').add({
							icon: 'throbber',
							duration: 200,
							header: '讀取中',
							content: options.url
						}),
						frame: $('<iframe>').data('an-tabs-id', tabId).appendTo(self.frames).attr('src', options.url)
					});
				}

				return tabId;
			},

			close: function(self, tab)
			{
				tab = self.getTab(tab);
				if(tab && tab.id !== 1) {
					self.unnotice(tab);
					tab.frame.remove();
					delete self.tabs[tab.id];

					if(tab === self.currentTab) {
						self.select(1);
					}
				}
			},

			unnotice: function(self, tab)
			{
				if(tab.notice) {
					annuus.api('notice').remove(tab.notice);
					delete tab.notice;
				}
			},

			select: function(self, tab, replace)
			{
				tab = self.getTab(tab);

				if(!tab) {
					self.log('error', 'tab with id "{0}" does not exist!', tab.id);
					return;
				}

				self.unnotice(tab);

				if(self.currentTab) {
					if(self.currentTab.id === tab.id) {
						return;
					}

					replace && self.currentTab.id !== 1 && self.close(self.currentTab);

					self.currentTab.frame.hide();
				}

				(self.currentTab = tab).frame.show();
			},

			widget: function(self, widget)
			{
				widget.empty();
				$.each(self.tabs, function(i, tab)
				{
					$('<a>', { text: tab.label || tab.title || tab.url, data: { 'an-tabs-id': tab.id } }).button().appendTo(widget);
				});
			}
		},

		'181f4cee-41e2-443c-87bb-e946a838411a': {
			condition: {
				test: window.frameElement && window.parent.annuus && window.parent.annuus.api('tabs')
			},
			run_at: 'document_start',
			js: function(self)
			{
				var tabs = window.parent.annuus.api('tabs');

				$(document).delegate('a', 'click', function(event)
				{
					var href = this.href;
					if(event.isDefaultPrevented() || href.indexOf('http://') !== 0) {
						return;
					}

					event.preventDefault();

					if(this.host === location.host) {
						tabs.open({ url: href });
					}
					else {
						window.open(href, '_blank');
					}
				});

				annuus.ready('document_end', function()
				{
					tabs.tabReady(window);
				});
			}
		},

		'3a16d6bf-9143-424f-80d4-2cebfd752ff3': {
			condition: {
				test: window.frameElement && window.parent.annuus && window.parent.annuus.api('tabs')
			},
			service: 'button',
			title: '標籤',
			widget: function(self)
			{
				return $('<div>').delegate('.ui-button', 'click', function(event)
				{
					var button = this;
					setTimeout(function()
					{
						window.parent.annuus.api('tabs').select(button);
					}, 0);
				});
			},
			click: function(self, event, widget)
			{
				window.parent.annuus.api('tabs').widget(widget);
			}
		}
	}
});
