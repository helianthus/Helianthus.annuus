annuus.add({

'fc6c2fbe-6d60-426b-b45f-acfabdb28f63': {
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
					#an-master-overlay { z-index: 120; top: -100%; } \
					#an-master-switch { z-index: 300; top: 10px; left: 10px; cursor: pointer; } \
					#an-master-sidebars { display: none; position: fixed; z-index: 130; left: 0; top: 70px; width: 150px; border-left: 0; } \
					#an-master-sidebars > div { display: none; max-height: 100%; } \
					#an-master-container { display: none; position: fixed; z-index: 150; top: 2%; right: 2%; bottom: 2%; left: 160px; } \
					#an-master-container > * { height: 100%; box-sizing: border-box; } \
					#an-master-nav { float: right; width: 150px; text-align: center; } \
					#an-master-nav a:focus { outline: 0; } \
					#an-master-panels { margin-right: 160px; } \
					#an-master-panels > div { display: none; height: 100%; position: relative; font-size: 110%; } \
					#an-master-panels > div > h1 { box-sizing: border-box; height: 2em; line-height: 2em; text-indent: 0.5em; } \
					#an-master-panels > div > div { position: absolute; top: 2em; bottom: 0; left: 0; right: 0; overflow: auto; font-size: 90%; } \
				');

				$('\
					<div id="an-master"> \
						<div id="an-master-overlay" class="ui-widget-overlay"></div> \
						<div id="an-master-sidebars"></div> \
						<div id="an-master-container"> \
							<ul id="an-master-nav"></ul> \
							<div id="an-master-panels" class="ui-widget-content ui-corner-all"></div> \
						</div> \
					</div> \
				')
				.appendTo('#annuus');

				self.overlay = $('#an-master-overlay');
				self.sidebars = $('#an-master-sidebars');
				var controls = self.sidebars.add('#an-master-container');
				var show;
				var fx = [
					function(next)
					{
						self.overlay.animate({ top: show ? '0%' : '-100%' }, show ? 800 : 200, show ? 'easeOutBounce' : 'swing', next);
						//self.overlay.animate({ height: show ? '100%' : '0%' }, 200, next);//show ? 800 : 200, show ? 'easeOutBounce' : 'swing', next);
					},
					function(next)
					{
						//controls.toggle('fade', {}, 400, next);
						show ? controls.fadeTo(0, 0, next).fadeTo(400, 1) : controls.fadeOut(400, next);
					}
				];
				var fxEnd = function()
				{
					self.togglePage(self, self.active, show, true);
				};

				$('<img/>', {
					id: 'an-master-switch',
					title: '左鍵設換面板 | 中鍵設換開關',
					src: self.data('images')[annuus.storage.get().status ? 'master-switch' : 'master-switch-grayscale'],
					mousedown: function(event)
					{
						var profile = annuus.storage.get({ mode: 'saved' });

						switch(event.which) {
							case 1:
							if(!profile.status || controls.queue().length || self.overlay.queue().length) return;

							var job;
							while(job = self.jobs.shift()) {
								self.build(self, job);
							}

							show = !show;
							document.body.style.overflow = show ? 'hidden' : '';
							$(document).queue('master-fx', (show ? fx.slice() : fx.slice().reverse()).concat(fxEnd)).dequeue('master-fx');

							break;
							case 2:
							event.preventDefault();

							profile.status = 1 - profile.status;
							annuus.storage.save();

							location.reload();
						}
					}
				}).appendTo('#an-master');
			},

			pages: [],

			build: function(self, job)
			{
				if(!self.nav) {
					self.nav = $('#an-master-nav').menu({
						select: function(event, ui)
						{
							self.switchTo(self, self.pages[ui.item.index()]);
						}
					});

					self.panels = $('#an-master-panels');
				}

				self.profile(job, function()
				{
					self.nav
					.append($.format('<li><a href="{0}">{1}</a></li>', annuus.get('DUMMY_HREF'), job.title))
					.menu('refresh');

					job.css && $.rules(job.css, job);

					var page = {
						job: job
					};

					page.controls = $($.format('<div><h1 class="ui-helper-reset ui-widget-header ui-corner-top">{0}</h1></div>', job.title))
						.append($('<div/>').append(page.panel = $(job.panel(job))))
						.appendTo(self.panels);

					if(job.sidebar) {
						page.controls.push(
							$('<div class="ui-widget-content ui-corner-right"></div>')
							.append(page.sidebar = $(job.sidebar(job)))
							.appendTo(self.sidebars)
						);
					}

					if(self.pages.length === 0) {
						self.active = page;
					}

					self.pages.push(page);
				});
			},

			switchTo: function(self, page)
			{
				if(page === self.active) {
					return;
				}
				self.togglePage(self, self.active, false);
				self.togglePage(self, page, true);
			},

			togglePage: function(self, page, show, atOnce)
			{
				if(!page) {
					return;
				}

				if(show) {
					self.active = page;
				}

				var speed = atOnce ? 0 : 400;

				page.controls.each(function(i)
				{
					if(i === 0) {
						$(this).stop(true, true).animate({ height: show ? 'show' : 'hide' }, speed, function()
						{
							var callback = page.job[show ? 'select' : 'unselect'];
							callback && setTimeout(function(){ callback(page.job, page); }, 0);
						});
					}
					else {
						$(this).stop(true, true).toggle('drop', { direction: 'left' }, speed);
					}
				});
			}
		}
	}
}

});
