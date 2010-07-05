annuus.addModules({

'e0311de6-a6fb-4bf5-bb91-e1f2db19d25b':
{
	title: 'Auto Service',
	pages: { core: [all] },
	tasks: {
		'4ea1dd56': {
			type: 'service',
			name: 'auto',
			add: {
				js: function(self, job)
				{
					if(job.frequency !== 'always') {
						job.remove();
					}
					else if(job.css) {
						$.log('warn', '"css" property found in task with frequency "always", make sure this is intended. [{0}, {1}]', job.module.title, job.id);
					}

					job.css && $.rules(job.css, job);
					job.js && job.js.call(bolanderi.__context[0], job);
				}
			}
		}
	}
}

});
