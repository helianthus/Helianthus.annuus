$(document).one('storage_ready', function()
{

var docPageCode = bolanderi.pageCode();
var profile = bolanderi.storage.get();
var statusTypes = profile.status ? ['core', 'debug', 'comp', 'on', 'off'] : 'core';
var compTypes = { core:1, comp:1 };
var services = bolanderi.get('SERVICES', {});
var api = bolanderi.get('API', {});
var actions = {};

function runService(service)
{
	bolanderi.trigger('service_start', service);

	service.wrapMethods();

	for(var key in service.api || {}) {
		var details = service.api[key];

		if(bolanderi.checkIf.missing(service, key)
		|| bolanderi.checkIf.wrongType(service[key], 'function', service)
		) {
			service.log('error', 'API creation failed, service dropped.');
			return;
		}

		$.make(api, service.name, key, service[key]);
	}

	bolanderi.trigger('service_ready', service);

	service.init && $.rules(function()
	{
		service.init(service.jobs);
	});

	services[service.name] = service;

	bolanderi.trigger('service_end', service);
}

function extendService(event, service)
{
	var task = event.data.task;

	if(service.name === task.name) {
		bolanderi.unbind(event);

		if(service.module.id !== task.module.id) {
			bolanderi.log('error', 'service can only be extended by sibling tasks! [{0}]', bolanderi.info(task));
			return;
		}

		$.extend($.make(service, 'api', {}), task.api);

		$.each(task, function(key, value)
		{
			if(key in service === false) {
				service[key] = value;
			}
		});

		bolanderi.trigger('service_extend', task);
	}
}

$.each(bolanderi.get('MODULES'), function(moduleId, module)
{
	$.digEach(module.pages, statusTypes, null, function(status, i, pageCode)
	{
		if(!(pageCode & docPageCode && (status in compTypes || status === 'debug' && bolanderi.get('DEBUG_MODE') || profile.privateData[moduleId][pageCode].status === 1))) {
			return;
		}

		module = $.extend({ _pageCode: pageCode }, module);

		if(!bolanderi.inCondition(module)) {
			return;
		}

		$.each(module.tasks, function(taskId, task)
		{
			if(!bolanderi.inCondition(task)) {
				return;
			}

			if(task.type === 'extend') {
				bolanderi.bind('service_start', { task: task }, extendService);
				return;
			}

			try {
				var job = new bolanderi.Job(task, true);
				job.module = module;
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
					job.wrapMethods();
					job.service = job.service || 'auto';
					$.make(actions, job.service, []).push(job);
				break;
				default:
					bolanderi.log('error', 'unknown task type "{0}" encountered, task dropped. [{1}]', job.type, job.info());
				break;
			}
		});

		return false;
	});
});

bolanderi.trigger('jobs_ready');

});
