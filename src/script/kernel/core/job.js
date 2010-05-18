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
		var profile = bolanderi.__storage.get({ savedOrDefault: typeof value === 'undefined' ? 'both' : 'saved' });
		var paths = {
			'public': [profile, 'publicData', dataType],
			'protected': [profile, 'privateData', this.module.id, dataType],
			'private': [profile, 'privateData', this.module.id, this.module.__pageCode, dataType]
		};
		var data;

		if(typeof value === 'undefined') {
			data = {};
			$.each(paths, function(modifier, path)
			{
				$.extend(data, $.dig(path));
			});
			return typeof id === 'undefined' ? data : data[id];
		}

		var dataDef = $.dig(this.module, dataType, id);

		if(!dataDef && !(id in profile.publicData[dataType])) {
			$.log('warn', 'public {0} with id "{1}" does not exist.', dataType, id);
			return;
		}

		data = $.make.apply(null, paths[dataDef ? dataDef.access || 'private' : 'public']);

		if(value === null) {
			delete data[id];
		}
		else {
			data[id] = value;
		}

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
	return function(options)
	{
		var job = new Job(task);

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
			options.js(options);
		}
	}
});

$(bolanderi).one('storageready', function()
{
	var docPageCode = $(document).pageCode();
	var profile = bolanderi.__storage.get();
	var passBasicRequirements = function(target)
	{
		return $.all(target.requires || {}, ['truthy', 'options'], function(type, requirement)
		{
			return (type === 'truthy' && requirement
			|| type === 'options' && $.all(requirement, function(i, optionSet)
			{
				return Job.prototype.options.call({ module: target.module || target }, optionSet.id) !== optionSet.value
			}));
		});
	};

	var apiTasks = [];
	var actionTasks = [];

	$.each(bolanderi.get('MODULES'), function(moduleId, module)
	{
		$.digEach(module.pages, ['comp', 'on', 'off'], null, function(status, i, pageCode)
		{
			if(pageCode & docPageCode) {
				module.__pageCode = pageCode;

				if(profile.privateData[module.id][pageCode].status >= 1 && passBasicRequirements(module)) {
					$.each(module.tasks || {}, function(j, task)
					{
						task.module = module;

						if((!('page' in task) || (task.page & docPageCode)) && passBasicRequirements(task)) {
							if(task.type in { ui:1, utility:1 }) {
								apiTasks.push(task);
							}
							else if((task.type || 'action') === 'action') {
								actionTasks.push(task);
							}
							else {
								$.log('warn', 'unknown task type "{0}" encountered. [{1}, {2}]', api.type, module.title, task.id);
							}
						}
					});
				}

				return false;
			}
		});
	});

	var passApiRequirements = function(task)
	{
		return $.all([].concat($.dig(task.module.requires, 'api'), $.dig(task.requires, 'api')), function(i, api)
		{
			return !api || $.dig([$].concat(requirements[i].split('.')));
		});
	};

	var passedUI = ['auto'];

	do {
		var oldLength = apiTasks.length;

		for(var i=0; i<apiTasks.length; ++i) {
			var task = apiTasks[i];

			if(!passApiRequirements(task)) {
				continue;
			}

			if(task.type === 'ui') {
				passedUI.push(task.name);
				$[task.name] = wrapUI(task);
			}
			else if(task.type === 'utility') {
				if(task.css) {
					$.log('warn', '"css" property for task type "utility" has no effect. [{0}, {1}]', task.module.title, task.id);
				}
				task.js(new Job(task));
			}

			apiTasks.splice(i--, 1);
		}
	}
	while(oldLength !== apiTasks.length);

	$.each(actionTasks, function(i, task)
	{
		if(!passApiRequirements(task)) {
			return;
		}

		var taskData = profile.privateData[task.module.id].tasks[task.id];
		var ui;

		$.each(taskData.ui || ['auto'], function(i, name)
		{
			if($.inArray(name, passedUI) !== -1) {
				task.__ui = name;
				return false;
			}
		});

		if(!task.__ui) {
			$.log('log', 'no registered ui found, task dropped. [{0}, {1}]', task.module.title, task.id);
			return;
		}

		bolanderi.__jobGroups[bolanderi.get('RUN_AT')[task.run_at || 'document_end'] + bolanderi.get('PRIORITY')[task.priority || 'normal']].push(new Job(task));
	});
});

})();
