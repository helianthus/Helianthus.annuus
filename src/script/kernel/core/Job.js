bolanderi.Job = function(options)
{
	$.extend(this, options);
};

bolanderi.__moduleData = function(module, dataType, id, value)
{
	var isGet = typeof id in { string:1, undefined:1 } && typeof value === 'undefined';
	var profile = bolanderi.__storage.get({ mode: isGet ? 'both' : 'saved' });
	var paths = {
		'public': [profile, 'publicData', dataType],
		'protected': [profile, 'privateData', module.id, dataType],
		'private': [profile, 'privateData', module.id, module.__pageCode, dataType]
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
		var dataDef = $.dig(module, dataType, id);

		if(dataType === 'options' && !dataDef && typeof $.dig(bolanderi.__storage.get(), 'publicData', dataType, id) === 'undefined') {
			$.log('error', 'public option with id "{0}" does not exist. {1}', id, module.title);
			return;
		}

		var container = $.make.apply(null, paths[dataDef ? dataDef.access || 'protected' : 'public'].concat({}));

		if(value === null) {
			delete container[id];
		}
		else {
			container[id] = value;
		}
	});

	bolanderi.__storage.save();
};

bolanderi.Job.prototype = {
	constructor: bolanderi.Job,

	context: function()
	{
		return bolanderi.__context;
	},

	data: function(name, value)
	{
		var data = this.module.data = this.module.data || {};

		if(typeof value === 'undefined') {
			data = $.extend({}, bolanderi.get('DATA'), data);
			return name ? data[name] : data;
		}
		else {
			data[name] = value;
		}
		return this;
	},

	database: function(id, value)
	{
		return bolanderi.__moduleData(this.module, 'database', id, value);
	},

	derive: function(options)
	{
		if(!(options && options.id)) {
			$.error('derived job is missing an id!');
		}

		return new bolanderi.Job($.extend({
			module: this.module,
			service: this.service,
			title: this.title,
			type: this.type
		}, options));
	},

	info: function()
	{
		return $.format('{0}, {1}, {2}{3}',
			this.module.title, this.id, this.type, this.type === 'action' ? $.format('({0})', this.service || 'unknown') : '');
	},

	options: function(id, value)
	{
		return bolanderi.__moduleData(this.module, 'options', id, value);
	},

	validate: function(job)
	{
		if('__validationResult' in job) {
			return job.__validationResult;
		}

		if(this.type !== 'service') {
			$.error('validate()/profile() is for services only. [{0}]', this.info());
		}

		if(!(job instanceof bolanderi.Job)) {
			$.log('error', 'Validation failed. param must be a job object (try self.derive). [{0}, {1}]', this.info(), bolanderi.info(job));
			return false;
		}

		return (job.__processResult = !$.any(this.params, function(name, details)
		{
			if('defaultValue' in details && !(name in job)) {
				job[name] = details.defaultValue;
			}

			if($.checkIf.missing(details, ['paramType', 'dataType'], this)
			|| $.checkIf.unknown(details.paramType, ['required', 'optional'], this)
			|| details.paramType === 'required' && $.checkIf.missing(job, name)
			|| name in job && $.checkIf.wrongType(job[name], details.dataType, job)
			|| 'values' in details && $.checkIf.unknown(job[name], details.values, job)
			) {
				return true;
			}
		}));
	},

	profile: function(jobs, fn)
	{
		var self = this;

		$.each([].concat(jobs), function(i, job)
		{
			if(!self.validate(job)) {
				return;
			}

			$.event.trigger('job_start', [job, self]);

			try {
				fn(i, job);
			}
			catch(e) {
				$.log('error', '{0} [{1}]', e.message, job.info());
				$.debug(e);
			}

			$.event.trigger('job_end', [job, self]);
		});
	}
};
