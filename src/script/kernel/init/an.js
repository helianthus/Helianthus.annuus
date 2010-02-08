(function($)
{
	function Job(data)
	{
		$.extend(this, data);
	}

	$.each(['options', 'db'], function(i, type)
	{
		Job.prototype[type] = function(name, val)
		{
			var
			storage = $.storage(val === undefined ? true : undefined),
			profile = storage.profiles[storage.curProfile],
			paths = {
				'public': [profile, 'publicData', type],
				'protected': [profile, 'privateData', this.plugin.id, type],
				'private': [profile, 'privateData', this.plugin.id, this.pageCode, type]
			},
			data;

			if(val === undefined) {
				data = {};
				$.each(paths, function(modifier, path)
				{
					$.extend(data, $.dig.apply(null, path));
				});
				return name === undefined ? data : data[name];
			}

			data = $.make.apply(null, paths[(data = $.dig(this.plugin, type, name)) ? data.access || 'private' : 'public']);

			if(val === null) {
				delete data[name];
			}
			else {
				data[name] = val;
			}

			$.storage(storage);
		};
	});

	var jobGroups = {};
	for(var i=1; i<=9; ++i) {
		jobGroups[i] = [];
	}
	$d.one('init', function()
	{
		var
		pageCode = $d.pageCode(),
		storage = $.storage(true),
		settings = storage.profiles[storage.curProfile].privateData;

		$.each(an.plugins, function(pluginId, plugin)
		{
			$.digEach(plugin.pages, null, function(status, i, pluginPageCode)
			{
				if(!(pluginPageCode & pageCode)) return;

				if(status !== 'disabled' && settings[pluginId][pluginPageCode].status >= 1) {
					plugin.id = pluginId;

					$.each(plugin.queue, function(i, fnSet)
					{
						if(!fnSet.page || fnSet.page & pageCode) {
							if(fnSet.css) $.rules(fnSet.css);
							if(fnSet.js) jobGroups[fnSet.priority || 4].push(new Job({ plugin: plugin, fnSet: fnSet, pageCode: pluginPageCode }));
						}
					});
				}

				return false;
			});
		});
	});

	Job.prototype.prioritize = function(priority, type, fn)
	{
		if(!fn) {
			fn = type;
			type = priority;
			priority = curPriority;
		}
		jobGroups[priority].push(new Job($.extend({}, this, { fnSet: { type: type, js: fn } })));
	};

	var curPriority,
	runUntil = function(until)
	{
		for(; curPriority <= until; ++curPriority) {
			$d.trigger($.format('priority{0}Start', curPriority));
			var group = jobGroups[curPriority];
			for(var i=0; i<group.length; ++i) {
				var job = group[i];
				if(job.fnSet.type !== always) group.splice(i--, 1);

				an.curJob = job;

				try {
					job.fnSet.js.call(job, job);
				}
				catch(e) {
					$.debug($.format('發生錯誤: {0}', job.plugin.desc), e, job, $j);
				}
			}
			$d.trigger($.format('priority{0}End', curPriority));
		}
	};

	$.timeout('checkdom', function()
	{
		if(document.getElementById('Side_GoogleAd')) {
			an.isDOMReady = true;
			$d.trigger('anLevel2');
		}
		else {
			$.timeout('checkdom', 50);
		}
	});

	$(window).one('load', function()
	{
		$.timeout(function()
		{
			an.isWindowLoaded = true;
			$d.trigger('anLevel3');
		});
	});

	$.fn.an = function()
	{
		$j = this;

		curPriority = 1;

		runUntil(3);

		$d.one('anLevel2', function()
		{
			runUntil(6);

			$d.one('anLevel3', function()
			{
				runUntil(9);
			});

			if(an.isWindowLoaded) $d.trigger('anLevel3');
		});

		if(an.isDOMReady) $d.trigger('anLevel2');

		return $j;
	};
})(jQuery);