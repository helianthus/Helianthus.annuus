(function($)
{
	var
	storage, defaultData,
	constructStorage = function()
	{
		storage = {
			'Flash': {
				get: function() {
					return an.lso.get('an', 'an');
				},
				set: function(val) {
					an.lso.set('an', 'an', val.replace(/\\/g, '\\\\'));
				},
				remove: function() {
					an.lso.remove('an', 'an');
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
		}[an.storageMode];

		// *** REMOVE ME *** //
		storage.remove();
	},
	constructDefaultData = function()
	{
		var statusMap = { disabled: -1, off: 0, on: 1, comp: 2 };

		defaultData = {
			publicData: {},
			privateData: {}
		};

		$.each(an.plugins, function(pluginId, plugin)
		{
			defaultData.privateData[pluginId] = {};

			$.each(plugin.pages, function(status, pageCode)
			{
				defaultData.privateData[pluginId][pageCode] = { status: statusMap[status] };
			});

			$.each(['options', 'db'], function(i, type)
			{
				if(plugin[type]) {
					$.each(plugin[type], function(dataId, dataSet)
					{
						if(!dataSet.access || dataSet.access === 'private') {
							$.each(defaultData.privateData[pluginId], function(pageCode, pageSet)
							{
								$.make(pageSet, type)[dataId] = dataSet.defaultValue;
							});
						}
						else {
						 $.make(dataSet.access === 'protected' ? defaultData.privateData[pluginId] : defaultData.publicData, type)[dataId] = dataSet.defaultValue;
						}
					});
				}
			});
		});
	};

	$.storage = function(val)
	{
		if(!storage) constructStorage();

		if(val === null) {
			return storage.remove();
		}
		else if(typeof val === 'object') {
			storage.set(JSON.stringify(val));
		}
		else {
			var data = val !== false && (data = storage.get()) ? JSON.parse(data) : {
				curProfile: 'default',
				profiles: {
					'default': {
						name: '預設'
					}
				}
			};

			if(typeof val === 'boolean') {
				if(!defaultData) constructDefaultData();

				for(var profileId in data.profiles) {
					data.profiles[profileId] = $.copy({}, defaultData, data.profiles[profileId]);
				}
			}

			return data;
		}
	};
})(jQuery);