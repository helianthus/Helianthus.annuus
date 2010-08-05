$(document).one('kernel_ready', function()
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
					bolanderi.error('public {0} id "{0}" already exists. [{0}]', dataType, dataId, module.title);
				}

				$.make(dataSet.access === 'public' ? defaultData.publicData : defaultData.privateData[moduleId], dataType, dataId, dataSet.defaultValue);
			}
		});
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

bolanderi.storage = {
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
		options = $.extend({ curProfileOnly: true, mode: 'mixed', noCache: false }, options);
		var data = cache[options.mode];

		if(options.noCache || !data) {
			data = cache[options.mode] = options.mode !== 'default' && storage.get() && JSON.parse(storage.get()) || {
				curProfile: 'default',
				profiles: {
					'default': {
						status: 1
					}
				}
			};

			if(options.mode !== 'saved') {
				for(var profileId in data.profiles) {
					data.profiles[profileId] = $.copy({}, defaultData, data.profiles[profileId]);
				}
			}
		}

		return options.curProfileOnly ? data.profiles[data.curProfile] : data;
	},

	save: function()
	{
		cache.saved ? storage.set(JSON.stringify(cache.saved)) : bolanderi.log('error', 'storage cache not found, save failed.');
		cache.both = null;
	},

	clear: function()
	{
		storage.clear();
		cache.saved = cache.both = null;
	},

	clean: function()
	{
		var storage = bolanderi.storage.get({ curProfileOnly: false, mode: 'saved' });
		var modules = bolanderi.get('MODULES');

		var map = {};
		$.digEach(modules, null, 'options', null, function(moduleId, dataType, optionId, optionDef)
		{
			if(optionDef.access === 'public') {
				map[optionId] = 1;
			}
		});

		$.digEach(storage.profiles, null, null, function(profileName, accessType, accessData)
		{
			switch(accessType) {
				case 'publicData':
				$.each(accessData.options || {}, function(optionId)
				{
					if(!map[optionId]) {
						delete accessData.options[optionId];
					}
				});
				break;
				case 'privateData':
				$.each(accessData, function(moduleId, moduleData)
				{
					if(!modules[moduleId]) {
						delete accessData[moduleId];
						return;
					}

					$.each(moduleData, function(pageCode, pageData)
					{
						if($.isNumber(pageCode)) {
							$.each(pageData, function(dataType)
							{
								cleanup(moduleId, pageData);
							});
						}
						else {
							cleanup(moduleId, moduleData);
						}
					});
				});
			}
		});

		function cleanup(moduleId, container)
		{
			var module = modules[moduleId]
			$.digEach(container, ['options', 'database'], function(dataType, data)
			{
				var dataDef = module[dataType];
				if(!dataDef) {
					delete container[dataType];
					return;
				}

				$.each(data, function(dataId)
				{
					if(!dataDef[dataId]) {
						delete container[dataType][dataId];
					}
				});
			});
		}

		bolanderi.storage.save();
	}
};

});
