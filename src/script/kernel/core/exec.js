(function()
{

var groupNo;
var serviceCache = {};

function wrapService(service)
{
	var wrapper = function(job)
	{
		$.digEach(service, ['setup', 'add'], function(type, subTask)
		{
			if(type === 'setup' ? service.__created : job === null) {
				return;
			}
			service.__created = true;

			subTask.css && $.rules(subTask.css, service);
			subTask.js && subTask.js(service, job);
		});
	};

	if(service.autorun) {
		wrapper(null);
	}

	$.each(serviceCache[service.name] || {}, function(i, job)
	{
		execComponent(job);
	});
	delete serviceCache[service.name];

	return wrapper;
}

function execComponent(job)
{
	job.service = job.service || 'auto';

	if(!(job.service in $)) {
		$.make(serviceCache, job.service, []).push(job);
		return;
	}

	$(bolanderi).trigger('jobstart', [job, groupNo]);

	try {
		$[job.service](job);
	}
	catch(e) {
		$.log('error', '{0} {1}', e.message, job.info());
	}

	$(bolanderi).trigger('jobend', [job, groupNo]);
}

var components = bolanderi.get('COMPONENTS', {});

bolanderi.__execGroups = function(eventType)
{
	groupNo = eventType && bolanderi.get('RUN_AT')[eventType];
	until = eventType && groupNo + $.size(bolanderi.get('PRIORITY')) - 1;

	for(; groupNo <= until; ++groupNo) {
		var group = bolanderi.get('JOBGROUPS')[groupNo];

		$(bolanderi).trigger('groupstart', [groupNo]);

		for(var i=0; i<group.length; ++i) {
			var job = group[i];

			if(job.type !== 'action' || job.__remove) {
				group.splice(i--, 1);
			}

			if(job.include) {
				if($.all(job.include, function(i, name)
				{
					return name in components;
				})) {
					$.digEach(components, job.include, function(name, component)
					{
						if(!component.__loaded) {
							component.__loaded = true;
							execComponent(component);
						}
					});
				}
				else {
					$.log('log', 'not all required components are found, task dropped. {0}', job.info());
					continue;
				}
			}

			if(!('name' in job) && /^(?:component|data|service)$/.test(job.type)) {
				$.log('error', 'missing "name" property, task dropped. {0}', job.info());
				continue;
			}

			if(job.type !== 'action') {
				$(bolanderi).trigger('jobstart', [job, groupNo]);
			}

			switch(job.type) {
				case 'action':
					execComponent(job);
					break;
				case 'component':
					if(job.name in components) {
						$.log('error', 'component name "{0}" already exists. {0}', job.name, job.info());
						break;
					}
					components[job.name] = job;
					break;
				case 'data':
					if(job.name in bolanderi.get('DATA')) {
						$.log('error', 'resource name "{0}" already exists. {0}', job.name, job.info());
						break;
					}
					bolanderi.get('DATA')[job.name] = job.json;
					break;
				case 'service':
					if(job.name in $) {
						$.log('error', 'service name "{0}" already exists. {1}', job.name, job.info());
						break;
					}
					$[job.name] = wrapService(job);
					break;
				case 'utility':
					if(job.css) {
						$.log('warn', '"css" property for task type "utility" has no effect. {0}', job.info());
					}
					job.js(job);
					break;
				default:
					$.log('error', 'unknown task type "{0}" encountered, task dropped. {1}', job.type, job.info());
			}
		}

		$(bolanderi).trigger('groupend', [groupNo]);
	}
}

})();
