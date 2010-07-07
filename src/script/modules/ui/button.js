annuus.addModules({

'34c76972-813a-4145-b3d3-bf83d89723d7':
{
	title: 'Button UI',
	pages: { comp: [all] },
	tasks: {
		'4ea1dd56': {
			type: 'service',
			name: 'button',
			run_at: 'document_start',
			params: {
				title: { paramType: 'required', dataType: 'string', description: 'button text' },
				href: { paramType: 'optional', dataType: 'string', description: 'button href' },
				css: { paramType: 'optional', dataType: 'string', description: 'css statements', params: ['self'] },
				js: { paramType: 'optional', dataType: 'function', description: 'click handler for the button', params: ['self', 'event'] }
			},
			init: function(self, jobs)
			{
				$.rules(self.css);
				self.create(self);
				$.each(jobs, function(i, job)
				{
					job.run(function()
					{
						$.service.button.add(job);
					});
				});
			},
			css: '\
				#an-buttonpanel { display: table; position: fixed; z-index: 50; height: 100%; } \
				#an-buttonpanel-positioner { display: table-cell; height: 100%; min-width: 10px; vertical-align: middle; } \
				#an-buttonpanel-ui { display: none; border-width: 0.5em 0; padding: 0.2em 0; } \
				#an-buttonpanel-container { box-sizing: border-box; min-width: 100px; border-left-width: 5px; overflow: hidden; font-size: 75%; } \
				#an-buttonpanel-container > .ui-button { display: block; margin: 3px 0 0 0; border-left: 0; border-top-left-radius: 0; border-bottom-left-radius: 0; text-align: left; } \
				#an-buttonpanel-container > .ui-button:first-child { margin: 0; } \
				#an-buttonpanel-container > .ui-button > span { padding: 0.1em 1em; white-space: nowrap; } \
			',
			create: function(self)
			{
				$('\
					<div id="an-buttonpanel"> \
						<div id="an-buttonpanel-positioner"> \
							<div id="an-buttonpanel-ui" class="an-header-bgborder ui-corner-right"> \
								<div id="an-buttonpanel-container" class="an-default-border"></div> \
							</div> \
						</div> \
					</div> \
				')
				.hover(function(event)
				{
					if(entered !== (event.type === 'mouseenter')) {
						entered = !entered;

						if(!ui.queue().length) {
							if(entered) {
								container.children().removeClass('ui-state-focus');
							}
							toggleCheck();
						}
					}
				})
				.delegate('.ui-button', 'click', function()
				{
					entered = false;
					toggleCheck(true);
				})
				.mousewheel(function(event, delta)
				{
					event.preventDefault();
					container.stop(true).animate({ scrollTop: $.format('{0}={1}', delta < 0 ? '+' : '-', Math.abs(delta) * 100) }, 'fast', 'linear');
				})
				.appendTo('#an');

				var ui = $('#an-buttonpanel-ui');
				var container = $('#an-buttonpanel-container');

				var entered = false;
				var toggleCheck = function(forceClose)
				{
					$.timeout('buttonpanel-toggleCheck', forceClose || entered ? false : 500, function()
					{
						if(entered !== ui.is(':visible')) {
							ui.toggle('fold', { size: 5 }, function()
							{
								toggleCheck();
							});
						}
					});
				};

				$(window).resize(function()
				{
					container.css('max-height', $(window).height() * 0.6);
				}).resize();
			},
			api: {
				add: function(self, options)
				{
					var button = $('<a/>', {
						text: options.title,
						href: options.href || annuus.get('DUMMY_HREF')
					})
					.button()
					.appendTo('#an-buttonpanel-container');

					if(options.js) {
						button.click(function(event)
						{
							event.preventDefault();
							options.css && $.rules(options.css, options);
							options.js.call(button[0], options, event);
						});
					}
				}
			}
		}
	}
}

});
