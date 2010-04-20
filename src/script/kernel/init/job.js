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
		var profile = an.__storage({ savedOrDefault: typeof value === 'undefined' ? 'both' : 'saved' });
		var paths = {
			'public': [profile, 'publicData', dataType],
			'protected': [profile, 'privateData', this.__module.id, dataType],
			'private': [profile, 'privateData', this.__module.id, this.__pageCode, dataType]
		};
		var data;

		if(typeof value === 'undefined') {
			data = {};
			$.each(paths, function(modifier, path)
			{
				$.extend(data, $.dig.apply(null, path));
			});
			return typeof id === 'undefined' ? data : data[id];
		}

		var dataDef = $.dig(this.__module, dataType, id);

		if(!dataDef && !(id in profile.publicData[dataType])) {
			$.notify('warn', 'public {0} with id "{1}" does not exist.', dataType, id);
			return;
		}

		data = $.make.apply(null, paths[dataDef ? dataDef.access || 'private' : 'public']);

		if(value === null) {
			delete data[id];
		}
		else {
			data[id] = value;
		}

		an.__storage.save();
	};
});

Job.prototype.context = function()
{
	return an.__context;
};

Job.prototype.data = function(name, value)
{
	var data = this.__module.data = this.__module.data || {};

	if(typeof value === 'undefined') {
		data[name] = value;
		return this;
	}
	else {
		return data[name];
	}
};

/*
Job.prototype.derive = function(newTask)
{
	if('page' in newTask) {
		$.notify('warn', '"page" property of dervied job "{0}" has no effect.', newTask.title || newTask.id);
	}

	var job = new Job(this);
	$.extend(job.__task, newTask);

	addJob(job);
};
*/

$(an).one('storageready', function()
{
	an.__jobGroups = {};
	$.each($.range(1, $.len(an.get('RUN_AT')) * $.len(an.get('PRIORITY'))), function(i, groupNo)
	{
		an.__jobGroups[groupNo] = [];
	});

	an.__api = {
		auto: {
			title: 'Auto',
			js: function(job)
			{
				job.__task.js(job);
			}
		}
	};

	var pageCode = $(document).pageCode();
	var profile = an.__storage();
	var passStatus = function(module)
	{
		var passPageCode = null;
		$.digEach(module && module.pages || {}, null, function(status, i, modulePageCode)
		{
			if(modulePageCode & pageCode) {
				if(status !== 'disabled' && profile.privateData[module.id][modulePageCode].status >= 1) {
					passPageCode = modulePageCode;
				}
				return false;
			}
		});
		return passPageCode;
	};
	var passRequirements = function(target)
	{
		var pass = true;
		$.digEach((target instanceof Job ? target.__module.requires : target.requires) || {}, null, function(type, i, requirement)
		{
			if(type === 'truthy' && !requirement
			|| type === 'modules' && !passStatus(an.get('MODULES')[requirement])
			|| type === 'options' && (target instanceof Job ? target.options(requirement.id) : $.dig(profile.publicData, 'options', requirement.id)) !== requirement.value
			) {
				$.notify('log', 'requirement "{0}" of {1} failed.', type, target.title || target.__task.id);
				pass = false;
				return false;
			}
		});
		return pass;
	};

	$.each(an.get('MODULES'), function(moduleId, module)
	{
		$.notify('debug', 'processing module {0}', module.title);
		var targetPageCode;

		if(!passRequirements(module) || !(targetPageCode = passStatus(module))) {
			return;
		}

		$.each(module.api || {}, function(i, api)
		{
			if(api.type === 'interface') {
				an.__api[api.name] = api;
			}
			else if(api.type === 'generic') {
				api.js();
			}
			else {
				$.notify('warn', 'unknown api type {0} is encountered in module {1}.', api.type, module.title);
			}
		});

		$.each(module.tasks || {}, function(taskId, task)
		{
			$.notify('debug', 'processing task {0} of module {1}', taskId, module.title);

			if((task.page || -1) & pageCode) {
				var taskData = profile.privateData[moduleId].tasks[taskId];
				var api = taskData.api || 'auto';

				if(!(api in an.__api)) {
					$.notify('log', 'api {0} is not registered, task "{1}" of module {2} dropped.', api, taskId, module.title);
					return;
				}

				var job = new Job({ __pageCode: targetPageCode, __module: module, __task: task, __api: api, __hotkey: taskData.hotkey });

				if(passRequirements(job) && (task.css || task.js)) {
					$.notify('debug', 'adding job {0}', taskId);
					an.__jobGroups[an.get('RUN_AT')[task.run_at || 'document_end'] + an.get('PRIORITY')[task.priority || 'normal']].push(job);
				}
			}
		});
	});
});

})();