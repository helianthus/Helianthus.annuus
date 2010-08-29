$(document).one('kernel_ready', function()
{

bolanderi.get('FLASH_API', $('<div/>', { id: 'bolanderi-lso' }).appendTo('#bolanderi').toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.now() : ''))[0]);

var engines = {
	'flash': {
		async: true,
		test: function() {
			return typeof bolanderi.get('FLASH_API').get !== 'function';
		},
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
		test: function() {
			return Modernizr.localstorage;
		},
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
		test: function() {
			return Modernizr.sessionstorage;
		},
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
		test: function() {
			return true;
		},
		get: $.noop,
		set: $.noop,
		clear: $.noop
	}
};

var cache = {};
var mode, engine;
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

bolanderi.storage = {
	mode: function(newMode)
	{
		if(newMode && newMode in engines) {
			mode = newMode;
			engine = engines[newMode];
			cache.saved = cache.mixed = null;
		}
		else {
			return mode;
		}
	},

	get: function(options)
	{
		options = $.extend({ curProfileOnly: true, mode: 'mixed', cache: true }, options);
		var data = cache[options.mode];

		if(!options.cache || !data) {
			data = cache[options.mode] = options.mode !== 'default' && engine.get() && JSON.parse(engine.get()) || {
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
		cache.saved ? engine.set(JSON.stringify(cache.saved)) : bolanderi.log('error', 'storage cache not found, save failed.');
		cache.mixed = null;
	},

	clear: function()
	{
		engine.clear();
		cache.saved = cache.mixed = null;
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
				break;
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

(function()
{
	var preferences = ['localStorage', 'flash', 'sessionStorage', 'null'];
	var index = $.inArray(mode = $.cookie('@PROJECT_NAME_SHORT@_storage_mode'), preferences);
	engine = engines[mode = index !== -1 ? preferences.splice(index, 1)[0] : preferences.shift()];

	$.run([100], function(countdown)
	{
		if(engine.test()) {
			bolanderi.trigger('storage_ready');
		}
		else if(engine.async && countdown) {
			$.run(this, 50, [--countdown]);
		} else {
			mode = preferences.shift();
			engine = engines[mode];
			$.run(this, 50, [100]);
		}
	});
})();

});
