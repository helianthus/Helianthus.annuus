annuus.addModules({

'fc6c2fbe-6d60-426b-b45f-acfabdb28f63':
{
	title: 'Master UI',
	pages: { core: [all] },
	tasks: {
		'4ea1dd56': {
			type: 'service',
			name: 'master',
			run_at: 'document_start',
			params: {
				title: { paramType: 'required', dataType: 'string' },
				css: { paramType: 'optional', dataType: 'string', description: 'css statements' },
				panel: { paramType: 'required', dataType: 'function', description: 'return a HTML element or jQuery object as main panel content', params: ['self'] },
				sidebar: { paramType: 'optional', dataType: 'function', description: 'return a HTML element or jQuery object as sidebar content', params: ['self'] }
			},
			init: function(self, jobs)
			{
				self.create(self);
			},

			create: function(self)
			{
				$.rules('\
					#an-master > * { position: fixed; } \
					#an-master-overlays > div { position: fixed; z-index: 120; opacity: 0.2; } \
					.an-master-overlay-horizontal { width: 0; } \
					.an-master-overlay-vertical { height: 0; } \
					.an-master-overlay-right { left: auto; right: 0; } \
					.an-master-overlay-bottom { top: auto; bottom: 0; } \
					\
					#an-master-switch { z-index: 300; top: 10px; left: 10px; cursor: pointer; } \
					\
					#an-master-sidebars { display: none; position: fixed; z-index: 130; left: 0; top: 70px; width: 150px; border-left: 0; } \
					#an-master-sidebars > div { display: none; max-height: 100%; } \
					\
					#an-master-container { display: none; position: fixed; z-index: 150; top: 2%; right: 2%; bottom: 2%; left: 160px; } \
					#an-master-container > * { height: 100%; box-sizing: border-box; } \
					#an-master-nav { float: right; width: 150px; text-align: center; } \
					#an-master-nav a:focus { outline: 0; } \
					#an-master-panels { margin-right: 160px; } \
					#an-master-panels > div { display: none; height: 100%; position: relative; font-size: 110%; } \
					#an-master-panels > div > h1 { box-sizing: border-box; height: 2em; line-height: 2em; text-indent: 0.5em; } \
					#an-master-panels > div > div { position: absolute; top: 2em; bottom: 0; left: 0; right: 0; overflow: auto; } \
					#an-master-panels > div > div > * { font-size: 90%; } \
				');

				$('\
					<div id="an-master"> \
						<div id="an-master-overlays"> \
							<div class="ui-widget-overlay an-master-overlay-vertical"></div> \
							<div class="ui-widget-overlay an-master-overlay-horizontal an-master-overlay-right"></div> \
							<div class="ui-widget-overlay an-master-overlay-vertical an-master-overlay-bottom"></div> \
							<div class="ui-widget-overlay an-master-overlay-horizontal"></div> \
						</div> \
						<div id="an-master-sidebars"></div> \
						<div id="an-master-container"> \
							<ul id="an-master-nav"></ul> \
							<div id="an-master-panels" class="ui-widget-content ui-corner-all"></div> \
						</div> \
					</div> \
				')
				.appendTo('#an');

				var overlays = $('#an-master-overlays > div');
				var show;
				$('<img/>', {
					id: 'an-master-switch',
					title: '左鍵設換面板 | 中鍵設換開關',
					src: self.data('images')[annuus.__storage.get().status ? 'master-switch' : 'master-switch-grayscale'],
					mousedown: function(event)
					{
						var profile = annuus.__storage.get({ mode: 'saved' });

						switch(event.which) {
							case 1:
							if(!profile.status) return;

							show = !show;

							var job;
							while(job = self.jobs.shift()) {
								self.build(self, job);
							}

							self.togglePage(self, self.active, show);

							$('#an-master-container, #an-master-sidebars').stop(true)[show ? 'fadeTo' : 'fadeOut'](400, show && 1);

							$.each([3,2,1,0], function(i, j)
							{
								var index = show ? i : j;
								var props = {};
								props[index % 2 === 0 ? 'height' : 'width'] = show ? '100%' : 0;

								$.timeout('master-overlay-' + i, i * 100, function()
								{
									overlays.eq(index).stop(true).animate(props, 400, 'easeOutSine');
								});
							});

							break;
							case 2:
							event.preventDefault();

							profile.status = 1 - profile.status;
							annuus.__storage.save();

							location.reload();
						}
					}
				}).appendTo('#an-master');

				$('#an-master-nav').menu({
					select: function(event, ui)
					{
						self.switchTo(self, self.pages[ui.item.index()]);
					}
				});

				$('#an-master-panels').fixScroll('h1+div');
			},

			switchTo: function(self, page)
			{
				if(page === self.active) {
					return;
				}
				self.togglePage(self, self.active, false);
				self.togglePage(self, page, true);
			},

			togglePage: function(self, page, show)
			{
				if(!page) {
					return;
				}

				if(show) {
					self.active = page;
				}

				page.controls.each(function(i)
				{
					var val = show ? 'show' : 'hide';
					if(i === 0) {
						$(this).stop(true, true).animate({ height: val }, 400);
					}
					else {
						$(this).stop(true, true).toggle('drop', { direction: 'left' }, 400);
					}
				});

				var type = show ? 'select' : 'unselect';
				type in page.self && page.self[type](page.self, page);
			},

			pages: [],

			build: function(self, options)
			{
				self.run(options, function()
				{
					$('#an-master-nav')
					.append($.format('<li><a href="{0}">{1}</a></li>', annuus.get('DUMMY_HREF'), options.title))
					.menu('refresh');

					options.css && $.rules(options.css, options);

					var page = {
						self: options
					};

					page.controls = $($.format('<div><h1 class="ui-helper-reset ui-widget-header ui-corner-top">{0}</h1></div>', options.title))
						.append($('<div/>').append(page.panel = options.panel(options)))
						.appendTo('#an-master-panels');

					if(options.sidebar) {
						page.controls.push(
							$('<div class="ui-widget-content ui-corner-right"></div>')
							.append(page.sidebar = options.sidebar(options))
							.appendTo('#an-master-sidebars')
						);
					}

					if(self.pages.length === 0) {
						self.active = page;
					}

					self.pages.push(page);
				});
			}
		}
	}
}

});
