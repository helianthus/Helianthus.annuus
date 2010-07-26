$(document).one('storage_ready', function()
{

var docPageCode = $(document).pageCode();
var profile = bolanderi.__storage.get();
var statusTypes = profile.status ? ['core', 'debug', 'comp', 'on', 'off'] : 'core';
var compTypes = { core:1, comp:1 };
var services = {};
var actions = {};
var isRequirementsMet = function(target)
{
	var module = target.module || target;
	return $.all(target.requires || {}, function(i, r)
	{
		var ret;
		switch(r.type) {
			case 'option':
			ret = bolanderi.__moduleData(module, 'options', r.params[0]) === r.params[1];
			break;
			case 'service':
			return true;
			case 'truthy':
			ret = !!r.params[0];
			break;
			default:
			$.log('error', 'unknown requirement type "{0}" encountered. [{1}]', r.type, module.title);
			return true;
		}
		return r.revert ? !ret : ret;
	});
};

$.each(bolanderi.get('MODULES'), function(moduleId, module)
{
	$.digEach(module.pages, statusTypes, null, function(status, i, pageCode)
	{
		if(pageCode & docPageCode && (module.__pageCode = pageCode)
		&& (status in compTypes || status === 'debug' && bolanderi.get('DEBUG_MODE') || profile.privateData[module.id][module.__pageCode].status === 1)
		&& isRequirementsMet(module)
		) {
			$.each(module.tasks, function(id, task)
			{
				if((task.page == null || task.page & docPageCode) && isRequirementsMet(task)) {
					var job = module.tasks[id] = new bolanderi.Job(task);

					switch(job.type) {
						case 'service':
						if($.checkIf.missing(job, ['name', 'init', 'run_at'])
						|| $.checkIf.exist(services, job.name, job)
						|| $.checkIf.unknown(job.run_at, bolanderi.get('RUN_AT_TYPES'), job)
						) {
							break;
						}

						job.jobs = $.make(actions, job.name, []);
						services[job.name] = [];

						$.each([].concat(job.module.requires, job.requires), function(i, r)
						{
							if(r && r.type === 'service') {
								services[job.name].push(r.params[0]);
							}
						});

						if(services[job.name].length) {
							$(document).bind('service_end', { service: job }, listenService);
						}
						else {
							$(document).one('work_' + job.run_at, { service: job }, runService);
						}

						break;
						case 'action':
						job.service = job.service || 'auto';
						$.make(actions, job.service, []).push(job);
						break;
						default:
						$.log('error', 'unknown task type "{0}" encountered, task dropped. [{1}]', job.type, job.info());
					}
				}
			});
			return false;
		}
	});
});

function listenService(event, service)
{
	var self = event.data.service;
	var index = $.inArray(service.name, services[self.name]);
	if(index !== -1) {
		services[self.name].splice(index, 1);
		if(services[self.name].length === 0) {
			bolanderi.ready(self.run_at, function()
			{
				runService({ data: { service: self } });
			});
		}
	}
}

function runService(event)
{
	var service = event.data.service;

	$.event.trigger('service_start', service);

	$.each(service.api || {}, function(name, details)
	{
		if(!$.checkIf.missing(service, name)) {
			$.make($, 'service', service.name, name, function()
			{
				if(name === 'add' && !service.validate(arguments[0])) {
					return;
				}
				service[name].apply(service, [service].concat([].slice.call(arguments)));
			});
		}
	});
	$.each(service.jobs, function(i, job)
	{
		service.validate(job);
	});
	$.rules(function()
	{
		service.init(service, service.jobs);
	});

	$.event.trigger('service_end', service);
}

});
