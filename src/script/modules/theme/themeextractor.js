annuus.addModules({

'c878628c-8414-4d1e-9a20-717d1dd0517c': {
	title: '主題轉換工具',
	pages: { debug: [all] },
	tasks: {
		'46ffedd9': {
			run_at: 'document_start',
			service: 'button',
			css: '\
				#an-themeextractor { position: fixed; top: 5%; left: 2%; width: 100%; height: 90%; } \
				#an-themeextractor > textarea { box-sizing: border-box; width: 45%; height: 100%; } \
				#an-themeextractor > button { width: 5%; height: 100%; vertical-align: bottom; } \
			',
			js: function(job)
			{
				$('\
					<div id="an-themeextractor"> \
						<textarea id="an-themeextractor-input"></textarea> \
							<button>&gt;</button> \
						<textarea id="an-themeextractor-output"></textarea> \
					</div> \
				')
				.delegate('textarea', 'click', function()
				{
					this.select();
				})
				.appendTo('#an')
				.find('button').click(function()
				{
					var input = $('#an-themeextractor-input').val();
					var output = {};
					$.each(['cornerRadius','borderColorHeader','bgColorHeader','fcHeader','borderColorContent','bgColorContent','fcContent',
					'borderColorDefault','bgColorDefault','fcDefault','borderColorHover','bgColorHover','fcHover','borderColorActive','bgColorActive','fcActive',
					'borderColorHighlight','bgColorHighlight','fcHighlight','borderColorError','bgColorError','fcError','bgColorOverlay','bgColorShadow'], function(i, name)
					{
						output[name] = input.match($.format('{0}=([^&]+)', name))[1];
					});
					$('#an-themeextractor-output').val(JSON.stringify(output, null, '\t'));
				});
			}
		}
	}
}

});
