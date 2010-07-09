annuus.addModules({

'4d8f8a79-93a5-4aa6-b33b-106310687f5e':
{
	title: '記錄面板',
	pages: { on: [all] },
	tasks: {
		'e6d2ea58': {
			service: 'master',
			title: '記錄',
			css: '\
				#an-master-log { padding: 1em; } \
				#an-master-log > li { display: block; font-size: 80%; } \
				#an-master-log > li > pre { margin: 0; } \
				.an-log-error { color: red; } \
			',
			panel: function(self)
			{
				var panel = $('<ul id="an-master-log" class="ui-helper-reset" />');

				function writeLog(event, type, msg)
				{
					panel.prepend($.format(
						'<li><pre>{1.getHours():02}:{1.getMinutes():02}:{1.getSeconds():02} <span class="an-log-{0}">[{0}] {2}</span></pre></li>',
						type, new Date(), $.format([msg].concat([].slice.call(arguments, 2))).toString().replace(/</g, '&lt;')
					));
				}

				$.each($.log.archives || {}, function(i, data)
				{
					writeLog.apply(null, [null].concat(data));
				});

				$(document).bind('log', writeLog);

				return panel;
			}
		}
	}
}

});
