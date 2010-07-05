annuus.addModules({

'51ff8602-647e-4e0f-a332-674799703a7b':
{
	title: 'Theme Service',
	pages: { comp: [all] },
	data: {
		hooks: []
	},
	tasks: {
		'475b4b70': {
			type: 'service',
			name: 'theme',
			add: function(self, param)
			{
				var hooks = self.data('hooks');
				var theme = param instanceof annuus.Job ? self.options() : param;

				if(param instanceof annuus.Job) {
					hooks.push(param);
					sendTheme(param);
				}
				else {
					$.each(hooks, function(i, hook)
					{
						sendTheme(hook);
					});
				}

				function sendTheme(hook)
				{
					hook.css && $.rules({ id: hook.name || hook.module.id + hook.id }, hook.css, theme);
					hook.js && hook.js(hook, theme);
				}
			}
		}
	}
}

});
