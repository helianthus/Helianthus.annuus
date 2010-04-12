$(an).one('tasksready', function()
{

var defaultData = {
	publicData: {},
	privateData: {}
};

$.each(an.tasks, function(taskId, task)
{
	defaultData.privateData[taskId] = {};

	$.digEach(task.pages, null, function(status, i, pageCode)
	{
		defaultData.privateData[taskId][pageCode] = { status: { disabled: -1, off: 0, on: 1, comp: 2 }[status] };
	});

	$.each(['options', 'db'], function(i, type)
	{
		if(task[type]) {
			$.each(task[type], function(dataId, dataSet)
			{
				if(!dataSet.access || dataSet.access === 'private') {
					$.each(defaultData.privateData[taskId], function(pageCode, pageSet)
					{
						$.make(pageSet, type)[dataId] = dataSet.defaultValue;
					});
				}
				else {
				 $.make(dataSet.access === 'protected' ? defaultData.privateData[taskId] : defaultData.publicData, type)[dataId] = dataSet.defaultValue;
				}
			});
		}
	});
});

var storage = {
	'Flash': {
		get: function() {
			return an.get('FLASH_API').get('an', 'an');
		},
		set: function(val) {
			an.get('FLASH_API').set('an', 'an', val.replace(/\\/g, '\\\\'));
		},
		remove: function() {
			an.get('FLASH_API').remove('an', 'an');
		}
	},

	'DOM': {
		get: function() {
			return localStorage.an;
		},
		set: function(val) {
			localStorage['an'] = val;
		},
		remove: function() {
			localStorage.removeItem('an');
		}
	}
}[an.get('STORAGE_MODE')];

$.storage = function(val)
{
	if(val === null) {
		storage.remove();
	}
	else if(typeof val === 'object') {
		storage.set(JSON.stringify(val));
	}
	else {
		var data = val !== false && (data = storage.get()) ? JSON.parse(data) : {
			curProfile: '預設',
			profiles: {
				'預設': {}
			}
		};

		if(typeof val === 'boolean') {
			for(var profileId in data.profiles) {
				data.profiles[profileId] = $.copy({}, defaultData, data.profiles[profileId]);
			}
		}

		return data;
	}
};

});