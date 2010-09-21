(function()
{

var modules = bolanderi.get('MODULES', {});
var tasks = bolanderi.get('TASKS', {});

bolanderi.add = function(module)
{
	if(bolanderi.checkIf.missing(module, ['id', 'title', 'pages', 'tasks'])
	|| bolanderi.checkIf.exist(modules, module.id)
	|| $.any(module.tasks, function(taskId)
	{
		return bolanderi.checkIf.exist(tasks, taskId);
	})) {
		return;
	}

	$.each(module.tasks, function(taskId, task)
	{
		$.extend(task, {
			module: module,
			id: taskId,
			title: task.title || module.title,
			type: task.type || 'action'
		});

		if(task.option) {
			$.make(module, 'options', taskId, { title: task.option.title, type: 'boolean', defaultValue: task.option.defaultValue });
			$.make(task, 'condition', 'options', taskId, true);
		}

		if(task.type === 'service') {
			$.extend(task, {
				api: task.api || {},
				params: task.params || {}
			});
		}

		tasks[taskId] = task;
	});

	modules[module.id] = module;
};

})();
