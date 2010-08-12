bolanderi.Job = function(options)
{
	$.each(options, function(name)
	{
		if(name in bolanderi.Job.prototype) {
			bolanderi.error('Job: overriding prototype methods is not allowed! [{0}]', bolanderi.info(options));
		}
	});

	$.extend(this, options);
};

bolanderi.Job.prototype = {
	constructor: bolanderi.Job,

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
		return bolanderi.moduleData(this.module, 'database', id, value);
	},

	derive: function(options)
	{
		if(!(options && options.id)) {
			bolanderi.error('derived job is missing an id!');
		}

		return new bolanderi.Job($.extend({
			module: this.module,
			service: this.service,
			title: this.title,
			type: this.type
		}, options));
	},

	log: function(type)
	{
		bolanderi.log(type, $.format('{0} [{1}]', $.format([].slice.call(arguments, 1)), this.info()));
	},

	inCondition: function()
	{
		return bolanderi.inCondition(this);
	},

	info: function()
	{
		return $.format('{0}, {1}, {2}{3}',
			this.title, this.id, this.type, this.type === 'action' ? $.format('({0})', this.service || 'unknown') : '');
	},

	options: function(id, value)
	{
		return bolanderi.moduleData(this.module, 'options', id, value);
	},

	ready: function(callback)
	{
		var self = this;
		var requires = $.compact([].concat(this.module.requires, this.requires));
		var handler = function()
		{
			if($.all(requires, function(i, name)
			{
				return name in bolanderi.get('SERVICES');
			})) {
				$(document).unbind('service_end', handler);

				bolanderi.ready(self.run_at, function()
				{
					if(self.inCondition()) {
						callback.call(null, self);
					}
					else {
						self.log('log', 'not in condition, job dropped.');
					}
				});
			}
		};

		$(document).bind('service_end', handler);
		handler();
	},

	validate: function(job)
	{
		if('__validationResult' in job) {
			return job.__validationResult;
		}

		if(this.type !== 'service') {
			bolanderi.error('validate()/profile() is for services only. [{0}]', this.info());
		}

		if(!(job instanceof bolanderi.Job)) {
			bolanderi.log('error', 'Validation failed. param must be a job object (try self.derive). [{0}, {1}]', this.info(), bolanderi.info(job));
			return false;
		}

		return (job.__validationResult = !$.any(this.params, function(name, details)
		{
			if('defaultValue' in details && !(name in job)) {
				job[name] = details.defaultValue;
			}

			if(bolanderi.checkIf.missing(details, ['paramType', 'dataType'], this)
			|| bolanderi.checkIf.unknown(details.paramType, ['required', 'optional'], this)
			|| details.paramType === 'required' && bolanderi.checkIf.missing(job, name)
			|| name in job && bolanderi.checkIf.wrongType(job[name], details.dataType, job)
			|| 'values' in details && bolanderi.checkIf.unknown(job[name], details.values, job)
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

			job.run_at = job.run_at || self.run_at;

			job.ready(function()
			{
				$.event.trigger('job_start', [job, self]);

				try {
					fn(i, job);
				}
				catch(e) {
					bolanderi.log('error', '{0} [{1}]', e.message, job.info());
					$.debug(e);
				}

				$.event.trigger('job_end', [job, self]);
			});
		});
	}
};
