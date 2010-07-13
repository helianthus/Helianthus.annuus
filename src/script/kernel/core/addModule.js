(function()
{

function normalize(target)
{
	$.each(target.requires || {}, function(i, r)
	{
		if(!$.isPlainObject(r)) {
			target.requires.splice(i, 1, (r = {
				type: { string: 'service', array: 'option' }[typeof r] || 'truthy',
				params: r
			}));
		}
		r.params = [].concat(r.params);
	});
}

var modules = bolanderi.get('MODULES', {});

bolanderi.addModules = function(newModules)
{
	$.each(newModules, function(moduleId, module)
	{
		if($.checkIf.exist(modules, moduleId) || $.checkIf.missing(module, ['title', 'pages'])) {
			return;
		}

		module.id = moduleId;
		normalize(module);

		$.each(module.tasks, function(taskId, task)
		{
			normalize(task);

			$.extend(task, {
				module: module,
				id: taskId,
				title: task.title || module.title,
				type: task.type || 'action'
			});

			if(task.option) {
				$.make(module, 'options', taskId, { title: task.option[0], type: 'boolean', defaultValue: task.option[1] });
				$.make(task, 'requires', []).push({ type: 'option', params: [taskId, true] });
			}
		});

		modules[moduleId] = module;
	});
};

})();
