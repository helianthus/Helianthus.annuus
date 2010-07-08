annuus.addModules({

'34c76972-813a-4145-b3d3-bf83d89723d7':
{
	title: 'Button UI',
	pages: { comp: [all] },
	tasks: {
		'4ea1dd56': {
			type: 'service',
			name: 'button',
			run_at: 'window_start',
			params: {
				title: { paramType: 'required', dataType: 'string' },
				run_at: { paramType: 'optional', dataType: 'string', values: annuus.get('RUN_AT_TYPES').slice(0), defaultValue: 'document_start' },
				href: { paramType: 'optional', dataType: 'string' },
				css: { paramType: 'optional', dataType: 'string', description: 'injected when button is clicked', params: ['self'] },
				widget: { paramType: 'optional', dataType: 'function', description: 'return a widget which is shown when the button is clicked', params: ['self'] },
				click: { paramType: 'optional', dataType: 'function', description: 'click handler', params: ['self', 'event'] }
			},
			api: {
				add: { description: 'add a new button', params: ['job'] }
			},
			init: function(self, jobs)
			{
				$.each(jobs || {}, function(i, job)
				{
					self.add(self, job);
				});
			},

			create: function(self)
			{
				$.rules('\
					#an-button { display: table; position: fixed; z-index: 50; height: 100%; } \
					#an-button-positioner { display: table-cell; height: 100%; min-width: 10px; vertical-align: middle; } \
					#an-button-ui { display: none; border-width: 0.5em 0; padding: 0.2em 0; } \
					#an-button-container { min-width: 100px; overflow: hidden; font-size: 75%; } \
					#an-button-container > * { display: none; } \
					#an-button-container .ui-button { display: block; margin: 3px 0 0 0; border-left: 0; border-top-left-radius: 0; border-bottom-left-radius: 0; text-align: left; } \
					#an-button-container .ui-button:first-child { margin: 0; } \
					#an-button-container .ui-button > span { padding: 0.1em 1em; white-space: nowrap; } \
				');

				$('\
					<div id="an-button"> \
						<div id="an-button-positioner"> \
							<div id="an-button-ui" class="an-header-bgborder ui-corner-right"> \
								<div id="an-button-container"> \
									<div/> \
								</div> \
							</div> \
						</div> \
					</div> \
				')
				.hover(function(event)
				{
					if(self.opened !== (event.type === 'mouseenter')) {
						self.opened = !self.opened;

						if(!self.ui.queue().length) {
							self.toggle(self);
						}
					}
				})
				.delegate('.ui-button', 'click', function()
				{
					self.opened = false;
					self.toggle(self, true);
				})
				.mousewheel(function(event, delta)
				{
					event.preventDefault();
					self.container.stop(true).animate({ scrollTop: $.format('{0}={1}', delta < 0 ? '+' : '-', Math.abs(delta) * 100) }, 'fast', 'linear');
				})
				.appendTo('#an');

				self.ui = $('#an-button-ui');
				self.container = self.ui.children();
				self.indexList = self.container.children();
				self.opened = false;

				$(window).resize(function()
				{
					self.container.css('max-height', $(window).height() * 0.6);
				}).resize();
			},

			toggle: function(self, force)
			{
				$.timeout('button-service-toggle', force || self.opened ? null : 500, function()
				{
					if(self.opened !== self.ui.is(':visible')) {
						if(self.opened) {
							self.container.children().hide().find('.ui-state-focus').removeClass('ui-state-focus');
							self.indexList.show();
						}
						self.ui.toggle('fold', { size: 5 }, 300, function()
						{
							self.toggle(self);
						});
					}
				});
			},

			add: function(self, options)
			{
				self.run(options, function()
				{
					if(!self.ui) {
						self.create(self);
					}

					var button = $('<a/>', {
						text: options.title,
						href: options.href || annuus.get('DUMMY_HREF')
					})
					.button()
					.appendTo(self.indexList);

					if(options.css) {
						button.one('click', function()
						{
							$.rules(options.css, options);
						});
					}

					if(options.widget) {
						button.click(function(event)
						{
							event.stopPropagation();
							self.indexList.slideUp(300, function()
							{
								$.make(options, '__widget', options.widget(options)).appendTo(self.container).slideDown(300);
							});
						});
					}

					if(options.click) {
						button.click(function(event)
						{
							event.preventDefault();
							options.click.call(button[0], options, event);
						});
					}
				});
			}
		},

		'adwaofaowfa': {
			js: function()
			{
				$.each($.range(1,30), function(i,n)
				{
					$.service.button.add({
						title: '測試按扭' + n
					});
				});
			}
		}
	}
}

});
