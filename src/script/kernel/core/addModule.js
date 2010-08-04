(function()
{

var modules = bolanderi.get('MODULES', {});

bolanderi.addModules = function(newModules)
{
	$.each(newModules, function(moduleId, module)
	{
		if($.checkIf.exist(modules, moduleId) || $.checkIf.missing(module, ['title', 'pages'])) {
			return;
		}

		module.id = moduleId;

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
		});

		modules[moduleId] = module;
	});
};

})();
