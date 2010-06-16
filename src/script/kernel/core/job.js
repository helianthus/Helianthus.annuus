bolanderi.Job = function(task)
{
	$.extend(this, task);
	this.task = task;
};

bolanderi.Job.prototype = {
	constructor: bolanderi.Job,

	_moduleData: function(dataType, id, value)
	{
		var isGet = typeof id in { string:1, undefined:1 } && typeof value === 'undefined';
		var profile = bolanderi.__storage.get({ savedOrDefault: isGet ? 'both' : 'saved' });
		var paths = {
			'public': [profile, 'publicData', dataType],
			'protected': [profile, 'privateData', this.module.id, dataType],
			'private': [profile, 'privateData', this.module.id, this.module.__pageCode, dataType]
		};
		var data = {};

		if(isGet) {
			$.each(paths, function(modifier, path)
			{
				$.extend(data, $.dig(path));
			});
			return typeof id === 'undefined' ? data : data[id];
		}

		if(typeof id === 'string') {
			data[id] = value;
		}
		else {
			data = id;
		}

		$.each(data, function(id, value)
		{
			var dataDef = $.dig(this.module, dataType, id);

			/*if(!dataDef && typeof $.dig(bolanderi.__storage.get(), 'publicData', dataType, id) === 'undefined') {
				$.log('warn', 'public {0} with id "{1}" does not exist.', dataType, id);
				return;
			}*/

			var container = $.make.apply(null, paths[dataDef ? dataDef.access || 'protected' : 'public'].concat({}));

			if(value === null) {
				delete container[id];
			}
			else {
				container[id] = value;
			}
		});

		bolanderi.__storage.save();

		return this;
	},

	context: function()
	{
		return bolanderi.__context;
	},

	database: function(id, value)
	{
		return this._moduleData('database', id, value);
	},

	data: function(name, value)
	{
		var data = this.module.data = this.module.data || {};

		if(typeof value === 'undefined') {
			return name ? data[name] : data;
		}
		else {
			data[name] = value;
		}
		return this;
	},

	hooks: function(target, name)
	{
		if(name === undefined) {
			return bolanderi.__hooks[target];
		}
		else {
			var params = [].slice.call(arguments, 2);
			$.digEach(bolanderi.__hooks, target, name, null, function(target, name, i, job)
			{
				if(job) {
					job.css && $.rules(job.css, job);
					job.js && job.js.apply(bolanderi.__context, [job].concat(params));

					if(job.frequency !== 'always') {
						bolanderi.__hooks[target][name][i] = null;
					}
				}
			});
		}
		return this;
	},

	options: function(id, value)
	{
		return this._moduleData('options', id, value);
	},

	resources: function()
	{
		return $.dig([bolanderi.__resources].concat([].slice.call(arguments)));
	}
};
