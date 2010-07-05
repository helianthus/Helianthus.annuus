$(bolanderi).one('kernelready', function()
{

var defaultData = {
	status: 1,
	publicData: {},
	privateData: {}
};

$.each(bolanderi.get('MODULES'), function(moduleId, module)
{
	defaultData.privateData[moduleId] = {};

	$.digEach(module.pages, null, null, function(status, i, pageCode)
	{
		defaultData.privateData[moduleId][pageCode] = { status: { disabled: -1, off: 0, on: 1, comp: 2, debug: 3, core: 4 }[status] };
	});

	$.each(['options', 'database'], function(i, dataType)
	{
		$.each(module[dataType] || {}, function(dataId, dataSet)
		{
			if(dataSet.access === 'private') {
				$.each(defaultData.privateData[moduleId], function(pageCode, pageSet)
				{
					$.make(pageSet, dataType, dataId, dataSet.defaultValue);
				});
			}
			else {
				if(dataSet.access === 'public' && $.dig(defaultData.publicData, dataType, dataId) != null) {
					$.error('public {0} id "{0}" already exists. [{0}]', dataType, dataId, module.title);
				}

				$.make(dataSet.access === 'public' ? defaultData.publicData : defaultData.privateData[moduleId], dataType, dataId, dataSet.defaultValue);
			}
		});
	});

	$.each(module.tasks, function(taskId, task)
	{
		if(task.option) {
			$.make(defaultData.privateData[moduleId], 'options', task.option[0], task.option[1]);
		}
		if(task.type in { action:1, component:1 }) {
			$.make(defaultData.privateData[moduleId], 'tasks', taskId, {
				hotkey: task.default_hotkey
			});
		}
	});
});

var storageEngines = {
	'flash': {
		get: function() {
			return bolanderi.get('FLASH_API').get('@PROJECT_NAME_SHORT@', '@PROJECT_NAME_SHORT@');
		},
		set: function(value) {
			bolanderi.get('FLASH_API').set('@PROJECT_NAME_SHORT@', '@PROJECT_NAME_SHORT@', value.replace(/\\/g, '\\\\'));
		},
		clear: function() {
			bolanderi.get('FLASH_API').remove('@PROJECT_NAME_SHORT@', '@PROJECT_NAME_SHORT@');
		}
	},

	'localStorage': {
		get: function() {
			return localStorage.getItem('@PROJECT_NAME_SHORT@');
		},
		set: function(value) {
			localStorage.setItem('@PROJECT_NAME_SHORT@', value);
		},
		clear: function() {
			localStorage.removeItem('@PROJECT_NAME_SHORT@');
		}
	},

	'sessionStorage': {
		get: function() {
			return sessionStorage.getItem('@PROJECT_NAME_SHORT@');
		},
		set: function(value) {
			sessionStorage.setItem('@PROJECT_NAME_SHORT@', value);
		},
		clear: function() {
			sessionStorage.removeItem('@PROJECT_NAME_SHORT@');
		}
	},

	'null': {
		get: $.noop,
		set: $.noop,
		clear: $.noop
	}
};

var storage, storageMode;
var cache = {};

bolanderi.__storage = {
	mode: function(mode)
	{
		if(mode) {
			storageMode = mode;
			storage = storageEngines[mode];
		}
		else {
			return storageMode;
		}
	},

	get: function(options)
	{
		options = $.extend({ curProfileOnly: true, savedOrDefault: 'both', noCache: false }, options);
		var data = cache[options.savedOrDefault];

		if(options.noCache || !data) {
			data = cache[options.savedOrDefault] = options.savedOrDefault !== 'default' && storage.get() && JSON.parse(storage.get()) || {
				curProfile: 'default',
				profiles: {
					'default': {
						status: 1
					}
				}
			};

			if(options.savedOrDefault !== 'saved') {
				for(var profileId in data.profiles) {
					data.profiles[profileId] = $.copy({}, defaultData, data.profiles[profileId]);
				}
			}
		}

		return options.curProfileOnly ? data.profiles[data.curProfile] : data;
	},

	save: function()
	{
		cache.saved ? storage.set(JSON.stringify(cache.saved)) : $.log('error', 'storage cache not found, save failed.');
		cache.both = null;
	},

	clear: function()
	{
		storage.clear();
		cache.saved = cache.both = null;
	}
};

});
