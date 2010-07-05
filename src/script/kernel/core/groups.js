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
			if(!$.isPlainObject(requirement)) {
				requirement = {
					type: { string: 'module', array: 'option' }[typeof requirement] || 'truthy',
					params: requirement
				};
			}

			var ret;
			var params = [].concat(requirement.params);

			switch(requirement.type) {
				case 'module':
					ret = isModuleOn(bolanderi.get('MODULES')[params[0]]);
					break;
				case 'option':
					ret = bolanderi.__moduleData(module, 'options', params[0]) === params[1];
					break;
				case 'truthy':
					ret = !!params[0];
					break;
				default:
					$.log('error', 'unknown requirement type "{0}" encountered. [{1}]', requirement.type, module.title);
					return true;
			}
			return requirement.revert ? !ret : ret;
		});
	};

	var jobGroups = bolanderi.get('JOBGROUPS', {});
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
									$.log('error', 'unknown {0} type "{1}" encountered, task dropped. [{2}, {3}]', prop, task[prop], module.title, task.id);
									return true;
								}
							})) {
								return;
							}

							jobGroups[
								task.type === 'action' || task.run_at || task.priority
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
});
