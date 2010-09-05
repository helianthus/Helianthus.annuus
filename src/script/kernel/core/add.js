(function()
{

var modules = bolanderi.get('MODULES', {});
var tasks = bolanderi.get('TASKS', {});

bolanderi.add = function(newModules)
{
	$.each(newModules, function(moduleId, module)
	{
		if(bolanderi.checkIf.exist(modules, moduleId)
		|| bolanderi.checkIf.missing(module, ['title', 'pages'])
		|| $.any(module.tasks, function(taskId)
		{
			return bolanderi.checkIf.exist(tasks, taskId);
		})) {
			return;
		}

		module.uuid = moduleId;

		$.each(module.tasks, function(taskId, task)
		{
			$.extend(task, {
				module: module,
				uuid: taskId,
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

		modules[moduleId] = module;
	});
};

})();
