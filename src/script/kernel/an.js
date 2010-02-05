(function($)
{
	function Job(data)
	{
		for(var prop in data) {
			this[prop] = data[prop];
		}
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

	var
	jobGroups,
	constructJobGroups = function()
	{
		jobGroups = {};

		for(var i=1; i<=9; ++i) {
			jobGroups[i] = [];
		}

		var
		pageCode = $.pageCode(),
		storage = $.storage(true),
		settings = storage.profiles[storage.curProfile].privateData;

		$.each(an.plugins, function(pluginId, plugin)
		{
			var pluginPageCode = $.bitmasks(pageCode, plugin.page);
			if(!pluginPageCode) return;

			var status = settings[pluginId][pluginPageCode].status;
			if(status < on) return;

			plugin.id = pluginId;

			$.each(plugin.queue, function(i, fnSet)
			{
				if(!fnSet.page || fnSet.page & pageCode) {
					jobGroups[fnSet.priority || 4].push(new Job({ plugin: plugin, fnSet: fnSet, pageCode: pluginPageCode }));
				}
			});
		});
	},
	curPriority,
	runUntil = function(until)
	{
		for(; curPriority <= until; ++curPriority) {
			var group = jobGroups[curPriority];
			for(var i=0; i<group.length; ++i) {
				var job = group[i];
				if(job.fnSet.type !== always) group.splice(i--, 1);

				an.curJob = job;

				try {
					job.fnSet.fn.call(job, job);
				}
				catch(e) {
					$.debug($.format('發生錯誤: {0}', job.plugin.desc), e, job, $j);
				}
			}
		}
	};

	$(window).one('load', function()
	{
		an.isWindowLoaded = true;
		$.timeout(function(){ $d.trigger('winload'); });
	});

	$.fn.an = function()
	{
		$j = this;

		if(!jobGroups) constructJobGroups();

		curPriority = 1;

		runUntil(3);
		$d.trigger('p3end');

		$(function()
		{
			runUntil(6);
			$d.trigger('p6end');
		});

		$d.one('winload', function()
		{
			runUntil(9);
			$d.trigger('p9end');
		});

		if(an.isWindowLoaded) $d.trigger('winload');

		return $j;
	};

	$.prioritize = function(priority, type, fn)
	{
		if(!fn) {
			fn = type;
			type = priority;
			priority = curPriority;
		}
		jobGroups[priority].push(new Job($.extend({}, an.curJob, { fnSet: { type: type, fn: fn } })));
	};
})(jQuery);