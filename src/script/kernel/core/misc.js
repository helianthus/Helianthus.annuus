(function()
{
	var modules = bolanderi.get('MODULES', {});

	bolanderi.addModules = function(newModules)
	{
		$.each(newModules, function(moduleId, module)
		{
			if(moduleId in modules) {
				return $.log('error', 'module id "{0}" already exists.', moduleId);
			}
			if(!module.title || !module.pages) {
				return $.log('error', 'missing a "title" or "pages" property. [{0}]', moduleId);
			}

			module.id = moduleId;

			$.each(module.tasks, function(taskId, task)
			{
				$.extend(task, {
					module: module,
					id: taskId,
					title: task.title || module.title,
					type: task.type || 'action',
				});

				if(module.include || task.include) {
					task.include = [].concat(module.include || [], task.include || []);
				}

				if(task.option) {
					$.make(module, 'options', taskId, { title: task.option[0], type: 'boolean', defaultValue: task.option[1] });
					$.make(task, 'requires', []).push({ type: 'option', params: [taskId, true] });
				}
			});

			modules[moduleId] = module;
		});
	};
})();

bolanderi.get('RUN_AT', { document_start: 1, document_end: 4, window_loaded: 7 });
bolanderi.get('PRIORITY', { high: 0, normal: 1, low: 2 });
bolanderi.get('DATA', {});
