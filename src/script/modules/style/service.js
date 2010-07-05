annuus.addModules({

'51ff8602-647e-4e0f-a332-674799703a7b':
{
	title: 'Theme Service',
	pages: { comp: [all] },
	tasks: {
		'475b4b70': {
			type: 'service',
			name: 'theme',
			add: function(self, job)
			{
				function execJob(job)
				{
					job.css && $.rules({ id: job.name || job.module.id + job.id }, job.css, options);
					job.js && job.js(job, options);
				}

				var jobs = $.make(self.data(), 'themeJobs', []);
				var options;

				if(job instanceof annuus.Job) {
					jobs.push(job);
					options = job.options();
					execJob(job);
				}
				else {
					options = job;
					$.each(jobs, function(i, job)
					{
						execJob(job, job);
					});
				}
			}
		}
	}
}

});
