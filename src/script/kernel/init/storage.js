$(bolanderi).one('modulesready', function()
{

var storage = {
	'Flash': {
		get: function() {
			return bolanderi.get('FLASH_API').get('bolanderi', 'bolanderi');
		},
		set: function(val) {
			bolanderi.get('FLASH_API').set('bolanderi', 'bolanderi', val.replace(/\\/g, '\\\\'));
		},
		clear: function() {
			bolanderi.get('FLASH_API').remove('bolanderi', 'bolanderi');
		}
	},

	'DOM': {
		get: function() {
			return localStorage.bolanderi;
		},
		set: function(val) {
			localStorage['bolanderi'] = val;
		},
		clear: function() {
			localStorage.removeItem('bolanderi');
		}
	}
}[bolanderi.get('STORAGE_MODE')];

var defaultData = {
	publicData: {},
	privateData: {}
};

$.each(bolanderi.get('MODULES'), function(moduleId, module)
{
	if(moduleId in defaultData.privateData) {
		$.error('module id "{0}" already exists.', moduleId);
	}

	if(!module.title || !module.pages) {
		$.error('missing a "title" or "pages" property. [{0}]', moduleId);
	}

	module.id = moduleId;
	defaultData.privateData[moduleId] = {};

	$.digEach(module.pages, null, null, function(status, i, pageCode)
	{
		defaultData.privateData[moduleId][pageCode] = { status: { disabled: -1, off: 0, on: 1, comp: 2 }[status] };
	});

	$.each(['options', 'database'], function(i, dataType)
	{
		$.each(module[dataType] || {}, function(dataId, dataSet)
		{
			if((dataSet.access || 'private') === 'private') {
				$.each(defaultData.privateData[moduleId], function(pageCode, pageSet)
				{
					$.make(pageSet, dataType)[dataId] = dataSet.defaultValue;
				});
			}
			else {
				if(dataSet.access === 'public' && $.dig(defaultData.publicData, dataType, dataId)) {
					$.error('public {0} id "{0}" already exists. [{0}]', dataType, dataId, module.title);
				}

				$.make(dataSet.access === 'protected' ? defaultData.privateData[moduleId] : defaultData.publicData, dataType)[dataId] = dataSet.defaultValue;
			}
		});
	});

	$.each(module.tasks || {}, function(taskId, task)
	{
		task.id = taskId;

		if((task.type || 'job') === 'job') {
			$.make(defaultData.privateData[moduleId], 'tasks')[taskId] = {
				ui: task.ui,
				hotkey: task.default_hotkey
			};
		}
	});
});

var cache = {};

bolanderi.__storage = $.extend(function(options)
{
	options = $.extend({ curProfileOnly: true, savedOrDefault: 'both', noCache: false }, options);

	if(options.noCache || !cache[options.savedOrDefault]) {
		cache[options.savedOrDefault] = options.savedOrDefault !== 'default' && storage.get() && JSON.parse(storage.get()) || {
			curProfile: 'default',
			profiles: {
				'default': {}
			}
		};

		if(options.savedOrDefault !== 'saved') {
			for(var profileId in cache[options.savedOrDefault].profiles) {
				cache[options.savedOrDefault].profiles[profileId] = $.copy({}, defaultData, cache[options.savedOrDefault].profiles[profileId]);
			}
		}
	}

	return options.curProfileOnly ? cache[options.savedOrDefault].profiles[cache[options.savedOrDefault].curProfile] : cache[options.savedOrDefault];
},
{
	save: function()
	{
		cache.saved ? storage.set(JSON.stringify(cache.saved)) : $.notify('warn', 'storage cache is not found, save failed.');
		cache.both = null;
	},

	clear: function()
	{
		storage.clear();
		cache.saved = cache.both = null;
	}
});

});
