annuus.addModules({

'fc6c2fbe-6d60-426b-b45f-acfabdb28f63':
{
	title: 'Master UI',
	pages: { core: [all] },
	tasks: {
		'f869f121': {
			run_at: 'document_start',
			css: '\
				#an-master { position: fixed; z-index: 20; } \
				#an-master > * { position: fixed; } \
				#an-master-overlays > div { position: fixed; opacity: 0.2; } \
				.an-master-overlay-horizontal { width: 0; } \
				.an-master-overlay-vertical { height: 0; } \
				.an-master-overlay-right { left: auto; right: 0; } \
				.an-master-overlay-bottom { top: auto; bottom: 0; } \
				#an-master-switch { top: 10px; left: 10px; cursor: pointer; } \
				\
				#an-master-container { display: none; position: fixed; top: 2%; right: 2%; bottom: 2%; left: 200px; } \
				#an-master-container > * { height: 100%; box-sizing: border-box; } \
				#an-master-nav { float: right; width: 150px; text-align: center; } \
				#an-master-nav a:focus { outline: 0; } \
				#an-master-panels { margin-right: 160px; } \
				#an-master-panels > div { display: none; height: 100%; position: relative; } \
				#an-master-panels > div > h3 { box-sizing: border-box; height: 2em; line-height: 2em; text-indent: 0.5em; } \
				#an-master-panels > div > div { box-sizing: border-box; position: absolute; top: 2em; bottom: 0; left: 0; right: 0; overflow: auto; } \
			',
			js: function(job)
			{
				$('\
					<div id="an-master"> \
						<div id="an-master-overlays"> \
							<div class="ui-widget-overlay an-master-overlay-vertical"></div> \
							<div class="ui-widget-overlay an-master-overlay-horizontal an-master-overlay-right"></div> \
							<div class="ui-widget-overlay an-master-overlay-vertical an-master-overlay-bottom"></div> \
							<div class="ui-widget-overlay an-master-overlay-horizontal"></div> \
						</div> \
						<div id="an-master-container"> \
							<ul id="an-master-nav"></ul> \
							<div id="an-master-panels" class="ui-widget ui-widget-content ui-corner-all"></div> \
						</div> \
					</div> \
				')
				.appendTo('#an');

				var overlays = $('#an-master-overlays > div');
				var show;
				$('<img/>', {
					id: 'an-master-switch',
					title: '左鍵設換面板 | 中鍵設換開關',
					src: job.resources('images', annuus.__storage.get().status ? 'master-switch' : 'master-switch-grayscale'),
					mousedown: function(event)
					{
						var profile = annuus.__storage.get({ savedOrDefault: 'saved' });

						switch(event.which) {
						case 1:
							if(!profile.status) return;

							show = !show;

							$('#an-master-container').stop(true)[show ? 'fadeTo' : 'fadeOut'](1000, show && 1);

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
						$('#an-master-panels > div').hide().eq(ui.item.index()).show();
					}
				});

				$('#an-master-panels').fixScroll('h3+div');
			}
		},

		'4ea1dd56': {
			type: 'ui',
			name: 'master',
			add: {
				js: function(job, options)
				{
					$('#an-master-nav')
					.append($.format('<li><a href="{0}">{1}</a></li>', annuus.get('DUMMY_HREF'), options.title))
					.menu('refresh');

					options.primary.css && $.rules(options.primary.css, options);

					$($.format('<div><h3 class="ui-helper-reset ui-widget-header ui-corner-top">{0}</h3></div>', options.title))
					.append($('<div/>').append(options.primary.js()))
					.appendTo('#an-master-panels');
				}
			}
		}
	}
}

});
