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
					#an-buttonpanel { overflow: hidden; position: fixed; top: 10%; width: 0.1%; height: 80%; } \
					#an-buttonpanel.show { width: auto; } \
					#an-buttonpanel > * { box-sizing: border-box; } \
					#an-buttonpanel > b { display: block; height: .5%; } \
					#an-buttonpanel > .ui-widget-header { height: 2%; } \
					#an-buttonpanel > div { position: relative; height: 96%; min-width: 50px; border-left-width: 0; font-size: 75%; } \
					#an-buttonpanel > div > b { position: absolute; top: 0; bottom: 0; width: 3px; } \
					#an-buttonpanel > div > .ui-button { display: block; margin: 0 0 3px 0; text-align: left; } \
					#an-buttonpanel > div > .ui-button > span { padding: 0.1em 1em; } \
				',
				js: function(job)
				{
					var working = false;
					var jPanel = $('\
						<div id="an-buttonpanel"> \
							<b class="ui-widget-header"></b> \
							<b></b> \
							<div> \
								<b class="ui-state-default"></b> \
							</div> \
						</div> \
					')
					.hover(function()
					{
						if(!working) {
							working = true;
							jPanel.stop(true, true).hide().css('width', 'auto').show('drop', {}, 500);
						}
					}, function()
					{
						working = false;
						jPanel.stop(true, true).hide('drop', {}, 500, function()
						{
							jPanel.css('width', '').show();
						});
					})
					.appendTo('#an');
				}
			},
			add: {
				js: function(job, options)
				{
					$('<a />', { html: options.title }).button().appendTo('#an-buttonpanel > div');
				}
			}
		},

		'49ca8ab8': {
			run_at: 'document_start',
			js: function()
			{
				$.button({
					title: 'test'
				});
				$.button({
					title: 'longertitle~~~'
				});
			}
		}
	}
}

}; });
