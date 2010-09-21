bolanderi.add({
	id: '88f89208-0448-45d4-a487-e3622ea70afb',
	title: 'Data Service',
	pages: { core: [all] },
	tasks: {
		'5228d14d-404d-44c3-9245-6a35018c1324': {
			type: 'service',
			name: 'data',
			run_at: 'window_start',
			params: {
				name: { paramType: 'required', dataType: 'string', description: 'data name' },
				json: { paramType: 'required', dataType: 'mixed', description: 'the actual data' }
			},
			init: function(self, jobs)
			{
				self.profile(jobs, function(i, job)
				{
					if(bolanderi.checkIf.exist(bolanderi.get('DATA', {}), job.name, job)) {
						return;
					}

					bolanderi.get('DATA')[job.name] = job.json;
				});
			}
		}
	}
});
