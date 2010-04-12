(function()
{

function Job(data)
{
	$.extend(this, data);
}

$.each(['options', 'db'], function(i, type)
{
	Job.prototype[type] = function(name, val)
	{
		var storage = $.storage(val === undefined ? true : undefined);
		var profile = storage.profiles[storage.curProfile];
		var paths = {
			'public': [profile, 'publicData', type],
			'protected': [profile, 'privateData', this.task.id, type],
			'private': [profile, 'privateData', this.task.id, this.pageCode, type]
		};
		var data;

		if(val === undefined) {
			data = {};
			$.each(paths, function(modifier, path)
			{
				$.extend(data, $.dig.apply(null, path));
			});
			return name === undefined ? data : data[name];
		}

		data = $.make.apply(null, paths[(data = $.dig(this.task, type, name)) ? data.access || 'private' : 'public']);

		if(val === null) {
			delete data[name];
		}
		else {
			data[name] = val;
		}

		$.storage(storage);
	};
});

Job.prototype.prioritize = function(priority, freq, fn)
{
	if(!fn) {
		fn = type;
		type = priority;
		priority = an.__curPriority;
	}
	jobGroups[priority].push(new Job($.extend({}, this, { fnSet: { freq: freq, js: fn } })));
};

$(an).one('storageready', function()
{
	var jobGroups = an.__jobGroups = {};

	for(var i=1; i<=9; ++i) {
		jobGroups[i] = [];
	}

	var pageCode = $d.pageCode();
	var storage = $.storage(true);
	var settings = storage.profiles[storage.curProfile].privateData;

	$.each(an.tasks, function(taskId, task)
	{
		$.digEach(task.pages, null, function(status, i, taskPageCode)
		{
			if(taskPageCode & pageCode) {
				if(status !== 'disabled' && settings[taskId][taskPageCode].status >= 1) {
					task.id = taskId;

					$.each(task.queue, function(i, fnSet)
					{
						if(!fnSet.page || fnSet.page & pageCode) {
							if(fnSet.css) $.rules(fnSet.css);
							if(fnSet.js) jobGroups[fnSet.priority || 4].push(new Job({ task: task, fnSet: fnSet, pageCode: taskPageCode }));
						}
					});
				}

				return false;
			}
		});
	});
});

})();