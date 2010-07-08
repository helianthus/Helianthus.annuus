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
			run_at: 'window_start',
			params: {
				name: { paramType: 'required', dataType: 'string', description: 'unique id for $.rules()' },
				position: { paramType: 'optional', dataType: 'string', values: ['pre', 'post'], defaultValue: 'post' },
				css: { paramType: 'optional', dataType: 'string', description: 'css statements, cannot use together with parameter "js"', params: ['theme'] },
				js: { paramType: 'optional', dataType: 'function', description: 'return css statements, cannot use together with parameter "css"', params: ['self', 'theme'] }
			},
			hooks: [],
			init: function(self, jobs)
			{
				$.each(jobs, function(i, job)
				{
					if('css' in job === 'js' in job) {
						$.log('error', 'either parameter "css" or "js" must exclusively exist, task dropped. [{0}]', job.info());
						return;
					}

					self.hooks.push(job);
				});

				$.service.theme.refresh(self.options());
			},
			api: {
				refresh: function(self, theme)
				{
					$.each(self.hooks, function(i, job)
					{
						job.run(function()
						{
							$.rules({ id: job.name, position: job.position }, 'css' in job ? job.css : job.js(job, theme), self.options());
						});
					});
				}
			}
		}
	}
}

});
