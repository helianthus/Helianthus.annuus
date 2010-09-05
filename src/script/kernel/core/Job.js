bolanderi.Job = function(options)
{
	if(this instanceof bolanderi.Job === false) {
		return new bolanderi.Job(options);
	}

	$.each(options, function(name)
	{
		if(name in bolanderi.Job.prototype) {
			bolanderi.error('Job: overriding prototype methods is not allowed! [{0}]', bolanderi.info(options));
		}
	});

	var self = this;

	$.each(options, function(key, obj)
	{
		self[key] = !$.isFunction(obj) ? obj : function()
		{
			var args = [self].concat([].slice.call(arguments));
			return self.run(function()
			{
				return obj.apply(this, args);
			});
		};
	});
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

	inCondition: $.memoize(function()
	{
		return bolanderi.inCondition(this);
	}),

	info: function()
	{
		return $.format('{0}, {1}, {2}{3}',
			this.title, this.id, this.type, this.type === 'action' ? $.format('({0})', this.service || 'unknown') : '');
	},

	options: function(id, value)
	{
		return bolanderi.moduleData(this.module, 'options', id, value);
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
				bolanderi.trigger('job_start', [job, self]);

				job.run(function()
				{
					fn(i, job);
				});

				bolanderi.trigger('job_end', [job, self]);
			});
		});
	},

	ready: function(callback)
	{
		var self = this;

		if(self.isReady) {
			callback.call(self, self);
		}
		else {
			var requires = $.compact([].concat(self.module.requires, self.requires));

			bolanderi.bindAndRun('service_end', function(event)
			{
				for(var i=requires.length;i--;) {
					if(requires[i] in bolanderi.get('SERVICES')) {
						requires.splice(i, 1);
					}
				}

				if(requires.length === 0) {
					bolanderi.unbind(event);

					bolanderi.ready(self.run_at, function()
					{
						if(self.inCondition()) {
							self.isReady = true;
							self.ready(callback);
						}
						else {
							self.log('log', 'not in condition, job dropped.');
						}
					});
				}
			});
		}
	},

	run: function(fn)
	{
		var tried = this._tried;
		this.tried = true;

		try {
			return fn.call(this, this);
		}
		catch(e) {
			if(tried) {
				throw e;
			}
			else {
				bolanderi.log('error', '{0} [{1}]', e.message, this.info());
				$.debug(e);
			}
		}
		finally {
			if(!tried) {
				this._tried = false;
			}
		}
	},

	validate: function(job)
	{
		var self = this;

		if(self.type !== 'service') {
			bolanderi.error('validate()/profile() is for services only. [{0}]', self.info());
		}

		if(!(job instanceof bolanderi.Job)) {
			bolanderi.log('error', 'Validation failed. param must be a job object (try self.derive). [{0}, {1}]', self.info(), bolanderi.info(job));
			return false;
		}

		return !$.any(self.params, function(name, details)
		{
			if('defaultValue' in details && !(name in job)) {
				job[name] = details.defaultValue;
			}

			if(bolanderi.checkIf.missing(details, ['paramType', 'dataType'], self)
			|| bolanderi.checkIf.unknown(details.paramType, ['required', 'optional'], self)
			|| details.paramType === 'required' && bolanderi.checkIf.missing(job, name)
			|| name in job && bolanderi.checkIf.wrongType(job[name], details.dataType, job)
			|| 'values' in details && bolanderi.checkIf.unknown(job[name], details.values, job)
			) {
				return true;
			}
		});
	}
};
