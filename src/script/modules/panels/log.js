annuus.add({
	id: '4d8f8a79-93a5-4aa6-b33b-106310687f5e',
	title: '記錄面板',
	pages: { on: [all] },
	tasks: {
		'27959dbd-6a92-401d-8673-7601ab5abc30': {
			service: 'master',
			title: '記錄',
			css: '\
				#an-master-log { width: 100%; height: 100%; box-sizing: border-box; margin: 0; border: 0; padding: 0.5em; font-size: 80%; font-family: monospace; resize: none; border-radius: 0; } \
			',
			panel: function(self)
			{
				self.panel = $('<textarea id="an-master-log" readonly />')[0];

				function writeLog(event, type, msg, date)
				{
					self.panel.value = $.format(
						'{1.getHours():02}:{1.getMinutes():02}:{1.getSeconds():02}.{1.getMilliseconds():03} [{0}] {2}{3}',
						type, date || new Date(), $.format([msg].concat([].slice.call(arguments, 2))), self.panel.value && '\n'
					) + self.panel.value;
				}

				$.each(annuus.log.archives || {}, function(i, data)
				{
					writeLog.apply(null, [null].concat(data));
				});

				annuus.bind('log', writeLog);

				return self.panel;
			}
		}
	}
});
