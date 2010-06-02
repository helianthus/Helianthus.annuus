annuus.addModules({

'34c76972-813a-4145-b3d3-bf83d89723d7':
{
	title: 'Button Panel',
	pages: { comp: [all] },
	tasks: {
		'4ea1dd56': {
			type: 'ui',
			name: 'button',
			setup: {
				css: '\
					#an-buttonpanel { display: table; position: fixed; height: 100%; } \
					#an-buttonpanel-positioner { display: table-cell; height: 100%; min-width: 10px; vertical-align: middle; } \
					#an-buttonpanel-ui { display: none; box-sizing: border-box; border-width: 0.5em 0; padding: 0.2em 0; } \
					#an-buttonpanel-container { box-sizing: border-box; height: 100%; min-width: 100px; border-left-width: 5px; overflow: hidden; font-size: 75%; } \
					#an-buttonpanel-container > .ui-button { display: block; margin: 3px 0 0 0; border-left: 0; border-top-left-radius: 0; border-bottom-left-radius: 0; text-align: left; } \
					#an-buttonpanel-container > .ui-button:first-child { margin: 0; } \
					#an-buttonpanel-container > .ui-button > span { padding: 0.1em 1em; white-space: nowrap; } \
				',
				js: function(job)
				{
					$('\
						<div id="an-buttonpanel"> \
							<div id="an-buttonpanel-positioner"> \
								<div id="an-buttonpanel-ui" class="an-header-border ui-corner-right"> \
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
					.mousewheel(function(event, delta)
					{
						event.preventDefault();
						container.stop(true).animate({ scrollTop: $.format('{0}={1}', delta < 0 ? '+' : '-', Math.abs(delta) * 100) }, 'fast', 'linear');
					})
					.appendTo('#an');

					var ui = $('#an-buttonpanel-ui');
					var container = $('#an-buttonpanel-container');

					var entered = false;
					var toggleCheck = function()
					{
						$.timeout('buttonpanel-toggleCheck', entered ? false : 500, function()
						{
							if(entered !== ui.is(':visible')) {
								ui[entered ? 'show' : 'hide']('fold', function()
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
				}
			},
			add: {
				js: function(job, options)
				{
					var button = $('<a />', {
						text: options.title,
						href: options.href || $.browser.opera && 'javascript:window.close()' || 'javascript:'
					})
					.button()
					.appendTo('#an-buttonpanel-container');

					if(options.js) {
						button.click(function(event)
						{
							event.preventDefault();
							options.js.call(button, options, event);
						});
					}
				}
			}
		}
	}
}

});
