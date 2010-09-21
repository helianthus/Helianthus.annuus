bolanderi.add({
	id: 'e0311de6-a6fb-4bf5-bb91-e1f2db19d25b',
	title: 'Auto Service',
	pages: { core: [all] },
	tasks: {
		'b13ee67b-178f-40a9-9d38-d43012c20d0e': {
			type: 'service',
			name: 'auto',
			run_at: 'window_start',
			params: {
				frequency: { paramType: 'optional', dataType: 'string', values: ['once', 'always'], defaultValue: 'once', description: 'rerun on ajax event if set to always' },
				run_at: { paramType: 'optional', dataType: 'string', values: bolanderi.get('RUN_AT_TYPES'), defaultValue: 'document_end' },
				css: { paramType: 'optional', dataType: 'string', description: 'css statements', params: ['self'] },
				js: { paramType: 'optional', dataType: 'function', description: 'do whatever you want here', params: ['self'] }
			},
			api: {
				add: { description: 'add an auto job', params: ['job'] }
			},
			init: function(self, jobs)
			{
				$.each(jobs, function(i, job)
				{
					self.add(job);
				});
			},

			add: function(self, job)
			{
				self.exec(job, bolanderi.doc);

				job.frequency === 'always' && bolanderi.bind('content_load', function(event, context)
				{
					if(job.css) {
						bolanderi.log('warn', '"css" property found in task with frequency "always", make sure this is intended. [{0}]', job.info());
					}
					self.exec(job, context);
				});
			},

			exec: function(self, job, context)
			{
				self.profile(job, function()
				{
					job.css && $.rules(job.css, job);
					job.js && job.js(context);
				});
			}
		}
	}
});
