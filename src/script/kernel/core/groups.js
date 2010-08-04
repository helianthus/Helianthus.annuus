$(document).one('storage_ready', function()
{

var docPageCode = $(document).pageCode();
var profile = bolanderi.__storage.get();
var statusTypes = profile.status ? ['core', 'debug', 'comp', 'on', 'off'] : 'core';
var compTypes = { core:1, comp:1 };
var services = [];
var actions = {};

$.each(bolanderi.get('MODULES'), function(moduleId, module)
{
	$.digEach(module.pages, statusTypes, null, function(status, i, pageCode)
	{
		if(pageCode & docPageCode && (module.__pageCode = pageCode)
		&& (status in compTypes || status === 'debug' && bolanderi.get('DEBUG_MODE') || profile.privateData[module.id][module.__pageCode].status === 1)
		&& bolanderi.inCondition(module)
		) {
			$.each(module.tasks, function(id, task)
			{
				if((task.page == null || task.page & docPageCode)) {
					var job = module.tasks[id] = new bolanderi.Job(task);

					switch(job.type) {
						case 'service':
							if($.checkIf.missing(job, ['name', 'init', 'run_at'])
							|| $.checkIf.exist(bolanderi, job.name, job)
							|| $.checkIf.exist(services, job.name, job)
							|| $.checkIf.unknown(job.run_at, bolanderi.get('RUN_AT_TYPES'), job)
							) {
								break;
							}

							services.push(job.name);
							job.jobs = $.make(actions, job.name, []);
							$(document).one('work', function()
							{
								job.ready(runService);
							});
						break;
						case 'action':
							job.service = job.service || 'auto';
							$.make(actions, job.service, []).push(job);
						break;
						default:
							$.log('error', 'unknown task type "{0}" encountered, task dropped. [{1}]', job.type, job.info());
						break;
					}
				}
			});
			return false;
		}
	});
});

function runService(service)
{
	$.event.trigger('service_start', service);

	$.each(service.api || {}, function(name, details)
	{
		if($.checkIf.missing(service, name)) {
			service.error('initialization failed.');
		}

		$.make(bolanderi, service.name, name, function()
		{
			return service[name].apply(service, [service].concat([].slice.call(arguments)));
		});
	});

	$.rules(function()
	{
		service.init(service, service.jobs);
	});

	bolanderi.get('SERVICES', {})[service.name] = service;

	$.event.trigger('service_end', service);
}

});
