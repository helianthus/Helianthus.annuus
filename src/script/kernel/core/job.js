(function()
{

function Job(src)
{
	$.extend(this, src);
}

$.each(['options', 'database'], function(i, dataType)
{
	Job.prototype[dataType] = function(id, value)
	{
		var isGet = typeof id in { string:1, undefined:1 } && typeof value === 'undefined';
		var profile = bolanderi.__storage.get({ savedOrDefault: isGet ? 'both' : 'saved' });
		var paths = {
			'public': [profile, 'publicData', dataType],
			'protected': [profile, 'privateData', this.module.id, dataType],
			'private': [profile, 'privateData', this.module.id, this.module.__pageCode, dataType]
		};
		var data = {};

		if(isGet) {
			$.each(paths, function(modifier, path)
			{
				$.extend(data, $.dig(path));
			});
			return typeof id === 'undefined' ? data : data[id];
		}

		if(typeof id === 'string') {
			data[id] = value;
		}
		else {
			data = id;
		}

		$.each(data, function(id, value)
		{
			var dataDef = $.dig(this.module, dataType, id);

			if(!dataDef && typeof $.dig(bolanderi.__storage.get(), 'publicData', dataType, id) === 'undefined') {
				$.log('warn', 'public {0} with id "{1}" does not exist.', dataType, id);
				return;
			}

			var container = $.make.apply(null, paths[dataDef ? dataDef.access || 'protected' : 'public']);

			if(value === null) {
				delete container[id];
			}
			else {
				container[id] = value;
			}
		});

		bolanderi.__storage.save();
	};
});

Job.prototype.context = function()
{
	return bolanderi.__context;
};

Job.prototype.data = function(name, value)
{
	var data = this.module.data = this.module.data || {};

	if(typeof value === 'undefined') {
		return name ? data[name] : data;
	}
	else {
		data[name] = value;
		return this;
	}
};

var resources = {};
Job.prototype.resources = function()
{
	return $.dig([resources].concat([].slice.call(arguments)));
};

$(bolanderi).one('kernelready', function()
{
	bolanderi.__jobGroups = {};
	$.each($.range(1, $.size(bolanderi.get('RUN_AT')) * $.size(bolanderi.get('PRIORITY'))), function(i, groupNo)
	{
		bolanderi.__jobGroups[groupNo] = [];
	});
});

function wrapUI(task)
{
	var job = new Job(task);
	return function(options)
	{
		$.digEach(task, ['setup', 'add'], function(type, actions)
		{
			if(type === 'setup' && task.__created) {
				return;
			}

			task.__created = true;
			actions.css && $.rules(actions.css, job);
			actions.js && actions.js(job, options);
		});
	};
}

$.auto = wrapUI({
	add: {
		js: function(job, options)
		{
			options.js && options.js(options);
		}
	}
});

bolanderi.__components = {};

$(bolanderi).one('storageready', function()
{
	var docPageCode = $(document).pageCode();
	var profile = bolanderi.__storage.get();
	var isModuleOn = function(module)
	{
		return !!module && profile.privateData[module.id][module.__pageCode].status >= 1;
	};
	var isRequiremenetsMet = function(target)
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
					ret = Job.prototype.options.call({ module: module }, params[0]) === params[1];
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

	var pendingModules = [];
	var pendingTasks = [];
	var passedActions = [];

	$.each(bolanderi.get('MODULES'), function(moduleId, module)
	{
		$.digEach(module.pages, ['comp', 'on', 'off'], null, function(status, i, pageCode)
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

		for(var i=0; i<pendingModules.length; ++i) {
			if(isRequiremenetsMet(pendingModules[i])) {
				var module = pendingModules.splice(i--, 1)[0];
				$.each(module.tasks, function(id, task)
				{
					if(task.page === undefined || task.page & docPageCode) {
						pendingTasks.push(task);
					}
				});
			}
		}

		for(var i=0; i<pendingTasks.length; ++i) {
			if(isRequiremenetsMet(pendingTasks[i])) {
				var task = pendingTasks.splice(i--, 1)[0];
				switch(task.type) {
					case undefined:
					case 'action':
						passedActions.push(task);
						break;
					case 'component':
						task.__ui = 'auto';
						bolanderi.__components[task.name] = new Job(task);
						break;
					case 'resource':
						resources[task.name] = task.json;
						break;
					case 'ui':
						$[task.name] = wrapUI(task);
						break;
					case 'utility':
						if(task.css) {
							$.log('warn', '"css" property for task type "utility" has no effect. [{0}, {1}]', task.module.title, task.id);
						}
						task.js(new Job(task));
						break;
					default:
						$.log('warn', 'unknown task type "{0}" encountered. [{1}, {2}]', task.type, module.title, task.id);
				}
			}
		}
	}
	while(modLen !== pendingModules.length || taskLen !== pendingTasks.length);

	$.each(passedActions, function(i, task)
	{
		$.each([].concat(profile.privateData[task.module.id].tasks[task.id].ui || 'auto'), function(i, name)
		{
			if(name in $) {
				task.__ui = name;
				return false;
			}
		});

		if(!task.__ui) {
			$.log('log', 'no registered ui found, task dropped. [{0}, {1}]', task.module.title, task.id);
			return;
		}

		if(!$.all(task.include || {}, function(i, name)
		{
			return name in bolanderi.__components;
		})) {
			$.log('log', 'not all required components are found, task dropped. [{0}, {1}]', task.module.title, task.id);
			return;
		}

		bolanderi.__jobGroups[bolanderi.get('RUN_AT')[task.run_at || 'document_end'] + bolanderi.get('PRIORITY')[task.priority || 'normal']].push(new Job(task));
	});
});

})();
