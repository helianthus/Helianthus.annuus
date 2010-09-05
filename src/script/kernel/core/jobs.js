$(document).one('storage_ready', function()
{

bolanderi.get('SERVICES', {});
var docPageCode = $(document).pageCode();
var profile = bolanderi.storage.get();
var statusTypes = profile.status ? ['core', 'debug', 'comp', 'on', 'off'] : 'core';
var compTypes = { core:1, comp:1 };
var services = {};
var actions = {};

function runService(service)
{
	bolanderi.trigger('service_start', service);

	$.each(service.api || {}, function(name, details)
	{
		if(bolanderi.checkIf.missing(service, name)) {
			service.error('initialization failed.');
		}

		$.make(bolanderi, service.name, name, service[name]);
	});

	bolanderi.trigger('service_ready', service);

	service.init && $.rules(function()
	{
		service.run(function()
		{
			service.init(service.jobs);
		});
	});

	bolanderi.get('SERVICES')[service.name] = service;

	bolanderi.trigger('service_end', service);
}

$.each(bolanderi.get('MODULES'), function(moduleId, module)
{
	$.digEach(module.pages, statusTypes, null, function(status, i, pageCode)
	{
		if(pageCode & docPageCode && (module.__pageCode = pageCode)
		&& (status in compTypes || status === 'debug' && bolanderi.get('DEBUG_MODE') || profile.privateData[moduleId][pageCode].status === 1)
		&& bolanderi.inCondition(module)
		) {
			$.each(module.tasks, function(taskId, task)
			{
				if(bolanderi.inCondition(task)) {
					try {
						var job = module.tasks[taskId] = new bolanderi.Job(task);
					}
					catch(e) {
						bolanderi.log('error', e.message);
						return;
					}

					switch(job.type) {
						case 'service':
							if(bolanderi.checkIf.missing(job, ['name', 'run_at'])
							|| bolanderi.checkIf.exist(bolanderi, job.name, job)
							|| bolanderi.checkIf.exist(services, job.name, job)
							|| bolanderi.checkIf.unknown(job.run_at, bolanderi.get('RUN_AT_TYPES'), job)
							) {
								break;
							}

							services[job.name] = job;
							job.jobs = $.make(actions, job.name, []);
							job.ready(runService);
						break;
						case 'action':
							job.service = job.service || 'auto';
							$.make(actions, job.service, []).push(job);
						break;
						case 'extend':
							bolanderi.bind('service_ready', function(event, service)
							{
								if(service.name === job.name) {
									bolanderi.unbind(event);

									if(service.module !== job.module) {
										job.error('service can only be extended by sibling tasks!');
									}

									$.extend(service.api, job.api);
									$.each(job, function(name, obj)
									{
										if(!(name in service)) {
											service[name] = obj;
										}
									});

									bolanderi.trigger('service_extend', job);
								}
							});
						break;
						default:
							bolanderi.log('error', 'unknown task type "{0}" encountered, task dropped. [{1}]', job.type, job.info());
						break;
					}
				}
			});
			return false;
		}
	});
});

bolanderi.trigger('jobs_ready');

});
