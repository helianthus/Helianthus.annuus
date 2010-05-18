annuus.addModules(function(){ return {

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
					#an-buttonpanel { position: fixed; top: 10%; height: 80%; min-width: 10px; } \
					#an-buttonpanel-ui { display: none; box-sizing: border-box; height: 100%; border-top-width: 0.5em; padding-top: 0.2em; } \
					#an-buttonpanel-container { overflow: hidden; box-sizing: border-box; height: 100%; min-width: 50px; border-left-width: 5px; font-size: 75%; } \
					#an-buttonpanel-container > .ui-button { display: block; margin: 0 0 3px 0; text-align: left; } \
					#an-buttonpanel-container > .ui-button > span { padding: 0.1em 1em; white-space: nowrap; } \
				',
				js: function(job)
				{
					$('\
						<div id="an-buttonpanel"> \
							<div id="an-buttonpanel-ui" class="an-header-border"> \
								<div id="an-buttonpanel-container" class="an-default-border"></div> \
							</div> \
						</div> \
					')
					.hover(function(event)
					{
						$('#an-buttonpanel-container').find('.ui-state-focus,.ui-state-hover').removeClass('ui-state-focus ui-state-hover');

						var enter = event.type === 'mouseenter';
						var queue = ui.queue('fx');

						if(typeof queue[0] === 'string') {
							if(queue.length > 1) {
								queue.pop();
							}
							if(showing !== enter) {
								queue.push(function(next)
								{
									showing = !showing;
									ui.toggle('fold');
									next();
								});
							}
						}
						else if(showing !== enter) {
							showing = !showing;
							ui.toggle('fold');
						}
					})
					.mousewheel(function(event, delta)
					{
						event.preventDefault();
						$('#an-buttonpanel-container').clearQueue().animate({ scrollTop: $.format('{0}={1}', delta < 0 ? '+' : '-', Math.abs(delta) * 100) }, 'fast', 'linear');
					})
					.appendTo('#an');

					var showing = false;
					var ui = $('#an-buttonpanel-ui');
				}
			},
			add: {
				js: function(job, options)
				{
					var button = $('<a />', {
						html: options.title,
						href: options.href || $.browser.opera && 'javascript:window.close()' || 'javascript:'
					})
					.button()
					.appendTo('#an-buttonpanel-container');

					if(options.js) {
						button.click(function(event)
						{
							event.preventDefault();
							options.js(options);
						});
					}
				}
			}
		},

		'49ca8ab8': {
			run_at: 'document_start',
			js: function()
			{
				$.each($.range(1, 40), function(i, val)
				{
					$.button({
						title: 'test button ' + val,
						js: function()
						{
							alert(this.title);
						}
					});
				});
			}
		}
	}
}

}; });
