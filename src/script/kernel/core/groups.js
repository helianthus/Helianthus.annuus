(function()
{

function wrapListener(job)
{
	$(bolanderi)[job.frequency === 'always' ? 'bind' : 'one'](job.name, function(event)
	{
		job.css && $.rules(job.css, job);
		job.js && job.js.apply(bolanderi.__context[0], [job].concat([].slice.call(arguments, 1)));
	});
}

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
		$.inArray(module.__pageCode, [].concat(module.pages.core || [], profile.status && module.pages.comp || [])) !== -1
		|| profile.privateData[module.id][module.__pageCode].status >= (profile.status ? 1 : 3)
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
				case 'api':
					ret = !!$.dig([$].concat(params[0].split('.')));
					break;
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

	bolanderi.__components = {};
	bolanderi.__resources = {};
	var pendingModules = [];
	var pendingTasks = [];
	var passedActions = [];

	$.each(bolanderi.get('MODULES'), function(moduleId, module)
	{
		$.digEach(module.pages, ['core', 'comp', 'on', 'off'], null, function(status, i, pageCode)
		{
			if(pageCode & docPageCode) {
				module.__pageCode = pageCode;
				if(isModuleOn(module)) {
					pendingModules.push(module);
				}
				return false;
			}
		});
	});

	do {
		var modLen = pendingModules.length;
		var taskLen = pendingTasks.length;

		for(var i = pendingModules.length; i--;) {
			if(isRequirementsMet(pendingModules[i])) {
				$.each(pendingModules.splice(i, 1)[0].tasks, function(id, task)
				{
					if(task.page === undefined || task.page & docPageCode) {
						pendingTasks.push(task);
					}
				});
			}
		}

		for(var i = pendingTasks.length; i--;) {
			if(isRequirementsMet(pendingTasks[i])) {
				var job = new bolanderi.Job(pendingTasks.splice(i, 1)[0]);

				switch(job.type) {
					case undefined:
					case 'action':
						passedActions.push(job);
						break;
					case 'component':
						if(job.name in bolanderi.__components) {
							$.log('error', 'component name "{0}" already exists.', job.name);
						}
						job.__ui = 'auto';
						bolanderi.__components[job.name] = job;
						break;
					case 'listener':
						wrapListener(job);
						break;
					case 'resource':
						if(job.name in bolanderi.__resources) {
							$.log('error', 'resource name "{0}" already exists.', job.name);
						}
						bolanderi.__resources[job.name] = job.json;
						break;
					case 'ui':
						$[job.name] = wrapUI(job);
						break;
					case 'utility':
						if(job.css) {
							$.log('warn', '"css" property for task type "utility" has no effect. [{0}, {1}]', job.module.title, job.id);
						}
						job.js(job);
						break;
					default:
						$.log('warn', 'unknown task type "{0}" encountered. [{1}, {2}]', job.type, module.title, job.id);
				}
			}
		}
	}
	while(modLen !== pendingModules.length || taskLen !== pendingTasks.length);

	bolanderi.__jobGroups = {};
	$.each($.range(1, $.size(bolanderi.get('RUN_AT')) * $.size(bolanderi.get('PRIORITY'))), function(i, groupNo)
	{
		bolanderi.__jobGroups[groupNo] = [];
	});

	$.each(passedActions, function(i, job)
	{
		$.each([].concat(profile.privateData[job.module.id].tasks[job.id].ui || 'auto'), function(i, name)
		{
			if(name in $) {
				job.__ui = name;
				return false;
			}
		});

		if(!job.__ui) {
			$.log('log', 'no registered ui found, task dropped. [{0}, {1}]', job.module.title, job.id);
			return;
		}

		if(!$.all(job.include || {}, function(i, name)
		{
			return name in bolanderi.__components;
		})) {
			$.log('log', 'not all required components are found, task dropped. [{0}, {1}]', job.module.title, job.id);
			return;
		}

		bolanderi.__jobGroups[bolanderi.get('RUN_AT')[job.run_at || 'document_end'] + bolanderi.get('PRIORITY')[job.priority || 'normal']].push(job);
	});
});

})();
