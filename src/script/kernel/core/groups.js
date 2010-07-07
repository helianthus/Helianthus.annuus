$(document).one('storageready', function()
{

var docPageCode = $(document).pageCode();
var profile = bolanderi.__storage.get();

var isModuleOn = function(module)
{
	return !!module && (
	$.inArray(module.__pageCode, [].concat(module.pages.core || [], profile.status && module.pages.comp || [], profile.status && bolanderi.get('DEBUG_MODE') && module.pages.debug || [])) !== -1
	|| profile.privateData[module.id][module.__pageCode].status === 1
	);
};
var isRequirementsMet = function(target)
{
	var module = target.module || target;
	return $.all(target.requires || {}, function(i, r)
	{
		var ret;
		switch(r.type) {
			case 'module':
			ret = isModuleOn(bolanderi.get('MODULES')[r.params[0]]);
			break;
			case 'option':
			ret = bolanderi.__moduleData(module, 'options', r.params[0]) === r.params[1];
			break;
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

var services = {};
var components = {};
var actions = [];

$.each(bolanderi.get('MODULES'), function(moduleId, module)
{
	$.digEach(module.pages, ['core', 'debug', 'comp', 'on', 'off'], null, function(status, i, pageCode)
	{
		if(pageCode & docPageCode && (module.__pageCode = pageCode) && isModuleOn(module) && isRequirementsMet(module)) {
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
						services[job.name] = job;
						$(document).one('work_' + job.run_at, function()
						{
							$.event.trigger('servicestart', job);
							$.each(job.api || {}, function(name, fn)
							{
								$.make($, 'service', job.name, name, function()
								{
									fn.apply(job, [job].concat([].slice.call(arguments)));
								});
							});
							job.init(job, services[job.name].jobs);
							$.event.trigger('serviceend', job);
						});
						break;
						case 'component':
						if($.checkIf.missing(job, ['name']) || $.checkIf.exist(components, job.name, job)) {
							break;
						}
						job.service = job.service || 'auto';
						components[job.name] = job;
						break;
						case 'action':
						job.service = job.service || 'auto';
						actions.push(job);
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

$.each(actions, function(i, action)
{
	if(!(action.service in services)
	|| 'params' in services[action.service] && $.any(services[action.service].params, function(name, details)
	{
		if('defaultValue' in details && !(name in action)) {
			action[name] = details.defaultValue;
		}

		if($.checkIf.missing(details, ['paramType', 'dataType'], action)
		|| $.checkIf.unknown(details.paramType, ['required', 'optional'], action)
		|| details.paramType === 'required' && $.checkIf.missing(action, name)
		|| name in action && $.checkIf.wrongType(action[name], details.dataType, action)
		|| 'values' in details && $.checkIf.unknown(action[name], details.values, action)
		) {
			return true;
		}
	})
	|| action.include && !$.all(action.include, function(i, name)
		{
			return name in components;
		},
		function(i, name)
		{
			if(!components[name].__loaded) {
				components[name].__loaded = true;
				$.make(services, components[name].service, 'jobs', []).push(components[name]);
			}
		})
	) {
		return;
	}

	$.make(services, action.service, 'jobs', []).push(action);
});

});
