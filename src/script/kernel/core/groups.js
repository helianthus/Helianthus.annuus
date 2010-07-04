(function()
{

function wrapUI(job)
{
	return function(options)
	{
		$.digEach(job, ['setup', 'add'], function(type, subTask)
		{
			if(type === 'setup' && job.__created) {
				return;
			}

			job.__created = true;
			subTask.css && $.rules(subTask.css, job);
			subTask.js && subTask.js(job, options);
		});
	};
}

$.auto = wrapUI({
	add: {
		js: function(job, options)
		{
			options.css && $.rules(options.css, options);
			options.js && options.js.call(bolanderi.__context[0], options);
		}
	}
});

$(bolanderi).one('storageready', function()
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
		return $.all(target.requires || {}, function(i, requirement)
		{
			var ret;
			var params = [].concat(requirement.params);
			switch(requirement.type) {
				case 'module':
					ret = isModuleOn(bolanderi.get('MODULES')[params[0]]);
					break;
				case 'option':
					ret = bolanderi.Job.prototype.options.call({ module: module }, params[0]) === params[1];
					break;
				case 'truthy':
					ret = !!params[0];
					break;
				default:
					$.log('warn', 'unknown requirement type "{0}" encountered. [{1}]', requirement.type, module.title);
					return true;
			}
			return requirement.revert ? !ret : ret;
		});
	};

	var jobGroups = {};
	$.each($.range(0, $.size(bolanderi.get('RUN_AT')) * $.size(bolanderi.get('PRIORITY'))), function(i, groupNo)
	{
		jobGroups[groupNo] = [];
	});

	$.each(bolanderi.get('MODULES'), function(moduleId, module)
	{
		$.digEach(module.pages, ['core', 'debug', 'comp', 'on', 'off'], null, function(status, i, pageCode)
		{
			if(pageCode & docPageCode) {
				module.__pageCode = pageCode;
				if(isModuleOn(module) && isRequirementsMet(module)) {
					$.each(module.tasks, function(id, task)
					{
						if((task.page === undefined || task.page & docPageCode) && isRequirementsMet(task)) {
							if($.any(['run_at', 'priority'], function(i, prop)
							{
								if(prop in task && !(task[prop] in bolanderi.get(prop.toUpperCase()))) {
									$.log('warn', 'unknown {0} type "{1}" encountered, task dropped. [{2}, {3}]', prop, task[prop], module.title, task.id);
									return true;
								}
							})) {
								return;
							}

							jobGroups[
								task.type in { undefined:1, action:1 } || task.run_at || task.priority
								? bolanderi.get('RUN_AT')[task.run_at || 'document_end'] + bolanderi.get('PRIORITY')[task.priority || 'normal']
								: 0
							].push(new bolanderi.Job(task));
						}
					});
				}
				return false;
			}
		});
	});

	var components = {};
	bolanderi.__hooks = {};
	bolanderi.__resources = {};

	bolanderi.__execGroups = function(eventType)
	{
		if(eventType === 0) {
			var groupNo = 0;
			var until = 0;
		}
		else {
			var groupNo = bolanderi.get('RUN_AT')[eventType];
			var until = groupNo + $.size(bolanderi.get('PRIORITY')) - 1;
		}

		for(; groupNo <= until; ++groupNo) {
			var group = jobGroups[groupNo];

			$(bolanderi).trigger('groupstart', [groupNo]);

			for(var i=0; i<group.length; ++i) {
				var job = group[i];

				if(!(job.type in { undefined:1, action:1 }) || job.frequency !== 'always') {
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
								execJob(component, groupNo);
							}
						});
						delete job.include;
					}
					else {
						$.log('log', 'not all required components are found, task dropped. [{0}, {1}]', job.module.title, job.id);
						continue;
					}
				}

				switch(job.type) {
					case undefined:
					case 'action':
						execJob(job, groupNo);
						break;
					case 'component':
						if(job.name in components) {
							$.log('error', 'component name "{0}" already exists. [{1}, {2}]', job.name, job.module.title, job.id);
						}
						components[job.name] = job;
						break;
					case 'hook':
						$.make(bolanderi.__hooks, job.target, job.name || '__default', []).push(job);
						break;
					case 'resource':
						if(job.name in bolanderi.__resources) {
							$.log('error', 'resource name "{0}" already exists. [{1}, {2}]', job.name, job.module.title, job.id);
						}
						bolanderi.__resources[job.name] = job.json;
						break;
					case 'ui':
						if(job.name in $) {
							$.log('error', 'ui name "{0}" already exists. [{1}, {2}]', job.name, job.module.title, job.id);
						}
						$[job.name] = wrapUI(job);
						break;
					case 'utility':
						if(job.css) {
							$.log('warn', '"css" property for task type "utility" has no effect. [{0}, {1}]', job.module.title, job.id);
						}
						job.js(job);
						break;
					default:
						$.log('warn', 'unknown task type "{0}" encountered, task dropped. [{1}, {2}]', job.type, job.module.title, job.id);
				}
			}

			$(bolanderi).trigger('groupend', [groupNo]);
		}
	}

	var execJob = function(job, groupNo)
	{
		if(!job.__ui && !$.any([].concat(profile.privateData[job.module.id].tasks[job.id].ui || 'auto'), function(i, name)
		{
			if(name in $) {
				job.__ui = name;
				return true;
			}
		})) {
			$.log('log', 'no registered ui found, task dropped. [{0}, {1}]', job.module.title, job.id);
			return;
		}

		$(bolanderi).trigger('jobstart', [job, groupNo]);

		try {
			$[job.__ui](job);
		}
		catch(e) {
			$.log('error', '{0} [{1}, {2}]', e.message, job.module.title, job.id);
		}

		$(bolanderi).trigger('jobend', [job, groupNo]);
	};
});

})();
