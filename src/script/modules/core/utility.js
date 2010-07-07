annuus.addModules({

'6dbe57c3-1aca-42d1-bfc7-edd1613b4114':
{
	title: 'Utility Service',
	pages: { core: [all] },
	tasks: {
		'4ea1dd56': {
			type: 'service',
			name: 'utility',
			run_at: 'window_start',
			params: {
				js: { paramType: 'required', dataType: 'function', description: 'do any non-DOM related work', params: ['self'] }
			},
			init: function(self, jobs)
			{
				$.each(jobs, function(i, job)
				{
					if(job.css) {
						$.log('warn', '"css" property for task type "utility" has no effect. {0}', job.info());
					}

					job.run(function()
					{
						job.js(job);
					});
				});
			}
		}
	}
}

});
