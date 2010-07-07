annuus.addModules({

'e0311de6-a6fb-4bf5-bb91-e1f2db19d25b':
{
	title: 'Auto Service',
	pages: { core: [all] },
	tasks: {
		'4ea1dd56': {
			type: 'service',
			name: 'auto',
			run_at: 'document_start',
			params: {
				frequency: { paramType: 'optional', dataType: 'string', values: ['once', 'always'], defaultValue: 'once', description: 'rerun on ajax event if set to always' },
				run_at: { paramType: 'optional', dataType: 'string', values: bolanderi.get('RUN_AT_TYPES').slice(1), defaultValue: 'document_end' },
				css: { paramType: 'optional', dataType: 'string', description: 'css statements', params: ['self'] },
				js: { paramType: 'optional', dataType: 'function', description: 'do whatever you want here', params: ['self'] }
			},
			init: function(self, jobs)
			{
				$.each(jobs, function(i, job)
				{
					bolanderi.ready(job.run_at, function()
					{
						self.add(self, job);
					});

					job.frequency === 'always' && $(document).bind('work', function()
					{
						self.add(self, job);
					});
				});
			},
			add: function(self, job)
			{
				if(job.frequency === 'always' && job.css) {
					$.log('warn', '"css" property found in task with frequency "always", make sure this is intended. [{0}]', job.info());
				}

				job.run(function()
				{
					job.css && $.rules(job.css, job);
					job.js && job.js.call(job.context(), job);
				});
			}
		}
	}
}

});
