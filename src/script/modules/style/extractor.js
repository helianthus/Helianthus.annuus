annuus.add({

'c878628c-8414-4d1e-9a20-717d1dd0517c': {
	title: '主題轉換工具',
	pages: { debug: [all] },
	tasks: {
		'46ffedd9': {
			service: 'master',
			css: '\
				#an-master-extractor { height: 100%; } \
				#an-master-extractor > div { float: left; box-sizing: border-box; width: 50%; height: 100%; padding: 10px; } \
				#an-master-extractor > div > div { margin-top: -1.3em; box-sizing: border-box; height: 100%; padding-top: 1.3em; } \
				#an-master-extractor > div > div > textarea { float: left; margin: 0; box-sizing: border-box; width: 100%; height: 100%; resize: none; } \
				#an-master-extractor-button { margin: 0; border: 0; width: 100%; border-top-left-radius: 0; border-bottom-left-radius: 0; } \
			',
			panel: function(self)
			{
				return $('\
					<div id="an-master-extractor"> \
						<div> \
							<h2 class="ui-widget ui-helper-reset">輸入:</h2> \
							<div> \
								<textarea id="an-master-extractor-input"></textarea> \
							</div> \
						</div> \
						<div> \
							<h2 class="ui-widget ui-helper-reset">輸出:</h2> \
							<div> \
								<textarea id="an-master-extractor-output"></textarea> \
							</div> \
						</div> \
					</div> \
				')
				.click(function(event)
				{
					switch(event.target.nodeName) {
						case 'textarea':
						event.target.select();
						break;
						case 'button':
						var input = $('#an-master-extractor-input').val();
						var output = {};
						$.each(['cornerRadius','borderColorHeader','bgColorHeader','fcHeader','borderColorContent','bgColorContent','fcContent',
						'borderColorDefault','bgColorDefault','fcDefault','borderColorHover','bgColorHover','fcHover','borderColorActive','bgColorActive','fcActive',
						'borderColorHighlight','bgColorHighlight','fcHighlight','borderColorError','bgColorError','fcError','bgColorOverlay','bgColorShadow'], function(i, name)
						{
							output[name] = input.match($.format('{0}=([^&]+)', name))[1];
						});
						$('#an-master-extractor-output').val(JSON.stringify(output, null, '\t'));
					}
				});
			},
			sidebar: function(self)
			{
				return $('<button/>', { id: 'an-master-extractor-button', text: '轉換' }).button();
			}
		}
	}
}

});
