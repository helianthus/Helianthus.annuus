(function()
{
	var modules = bolanderi.get('MODULES', {});

	bolanderi.addModules = function(getModules)
	{
		$.each(getModules(), function(moduleId, module)
		{
			if(moduleId in modules) {
				$.error('module id "{0}" already exists.', moduleId);
			}
			if(!module.title || !module.pages) {
				$.error('missing a "title" or "pages" property. [{0}]', moduleId);
			}

			module.id = moduleId;
			modules[moduleId] = module;
		});
	};
})();

bolanderi.get('RUN_AT', { document_start: 1, document_end: 4, window_loaded: 7 });
bolanderi.get('PRIORITY', { high: 0, normal: 1, low: 2 });
