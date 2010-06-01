annuus.addModules({

'fc6c2fbe-6d60-426b-b45f-acfabdb28f63':
{
	title: 'Master UI',
	pages: { core: [all] },
	tasks: {
		'4ea1dd56': {
			run_at: 'document_start',
			css: '\
				#an-master { position: fixed; z-index: 20; } \
				#an-master > * { position: fixed; } \
				#an-master-overlays > div { position: fixed; opacity: 0.2; } \
				.an-master-overlay-horizontal { width: 0; } \
				.an-master-overlay-vertical { height: 0; } \
				.an-master-overlay-right { left: auto; right: 0; } \
				.an-master-overlay-bottom { top: auto; bottom: 0; } \
				#an-master-container { display: none; width: 100%; height: 100%; } \
				#an-master-container > * { position: absolute; } \
				#an-master-switch { top: 10px; left: 10px; cursor: pointer; transition: transform 60s linear; } \
				#an-master-switch:hover { transform: rotate(3600deg); } \
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
						<div id="an-master-container"></div> \
					</div> \
				')
				.appendTo('#an');

				var overlays = $('#an-master-overlays > div');
				var animating;
				$('<img/>', {
					id: 'an-master-switch',
					title: '左鍵設換面板 | 中鍵設換開關',
					src: job.resources('images', annuus.__storage.get().status ? 'master-switch' : 'master-switch-grayscale'),
					mousedown: function(event)
					{
						var profile = annuus.__storage.get({ savedOrDefault: 'saved' });

						switch(event.which) {
						case 1:
							if(animating || !profile.status) return;
							animating = true;

							var shown = overlays.height();
							$.each([3,2,1,0], function(i, j)
							{
								var index = shown ? j : i;
								var props = {};
								var side = index % 2 === 0 ? 'height' : 'width';
								props[side] = shown ? 0 : '100%';
								$.timeout(i * 200, function()
								{
									overlays.eq(index).animate(props, { duration: 500, easing: 'easeOutSine', complete: function()
									{
										if(index === 3) {
											$(annuus).trigger('master-toggle', $('#an-master-container').toggle('fade'));
										}
										if(i === 3) {
											animating = false;
										}
									}});
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
			}
		},

		'8740e9a0': {
			type: 'listener',
			name: 'master-toggle',
			js: function(job, container)
			{
			}
		}
	}
}

});
