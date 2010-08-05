annuus.addModules({

'51ff8602-647e-4e0f-a332-674799703a7b': {
	title: 'Theme Service',
	pages: { comp: [all] },
	tasks: {
		'475b4b70': {
			type: 'service',
			name: 'theme',
			run_at: 'document_start',
			params: {
				name: { paramType: 'required', dataType: 'string', description: 'unique id for $.rules()' },
				position: { paramType: 'optional', dataType: 'string', values: ['pre', 'post'], defaultValue: 'post' },
				css: { paramType: 'optional', dataType: 'string', description: 'css statements, cannot use together with parameter "js"', params: ['theme'] },
				js: { paramType: 'optional', dataType: 'function', description: 'return css statements, cannot use together with parameter "css"', params: ['self', 'theme'] }
			},
			api: {
				add: { description: 'add new theme job.', param: ['job'] },
				load: { description: 'load a new theme.', param: ['theme'] }
			},
			init: function(self, jobs)
			{
				for(var i=0; i<jobs.length; ++i) {
					if('css' in jobs[i] === 'js' in jobs[i]) {
						bolanderi.log('error', 'either parameter "css" or "js" must exclusively exist, task dropped. [{0}]', jobs[i].info());
						jobs.splice(i--, 1);
					}
				}

				self.theme = self.options();
				self.load(self, self.theme);
			},

			add: function(self, job)
			{
				self.jobs.push(job);
				self.load(self, self.theme, job);
			},

			load: function(self, theme, jobs)
			{
				self.theme = theme;

				$.rules(function()
				{
					self.profile(jobs || self.jobs, function(i, job)
					{
						$.rules({ id: job.name, position: job.position }, 'css' in job ? job.css : job.js(job, theme), self.theme);
					});
				});
			}
		}
	}
}

});
