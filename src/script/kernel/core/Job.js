bolanderi.get('JOBS', {});

bolanderi.Job = function(options, manual)
{
	if(this instanceof bolanderi.Job === false) {
		return new bolanderi.Job(options);
	}

	if(!options.id || options.id in bolanderi.get('JOBS')) {
		bolanderi.error('Job: id does not exist or is already taken! [{0}]', bolanderi.info(options));
	}

	var self = this;

	$.each(options, function(key)
	{
		if(key in self) {
			bolanderi.error('Job: overriding prototype methods is not allowed! [{0}]', bolanderi.info(options));
		}
	});

	$.extend(self, options);

	if(!manual) {
		self.wrapMethods();
	}

	bolanderi.get('JOBS')[self.id] = self;
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
		bolanderi.log(type, '{0} [{1}]', $.format([].slice.call(arguments, 1)), this.info());
	},

	inCondition: $.once(function()
	{
		return bolanderi.inCondition(this);
	}),

	info: function()
	{
		return $.format('{0.title}, {0.id}, {0.type}{1}', this, this.type === 'action' ? '({0.service|unknown})' : '');
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

	run: $.arg({}, function(data, fn)
	{
		if(data.tracking) {
			return fn.call(this, this);
		}
		else {
			data.tracking = true;
			try {
				return fn.call(this, this);
			}
			catch(e) {
				bolanderi.log('error', '{0} [{1}]', e.message, this.info());
				$.debug(e);
			}
			finally {
				data.tracking = false;
			}
		}
	}),
	/*$.arg({}, function(track, fn)
	{
		if(track[this.id]) {
			return fn.call(this, this);
		}
		else {
			track[this.id] = true;
			try {
				return fn.call(this, this);
			}
			catch(e) {
				bolanderi.log('error', '{0} [{1}]', e.message, this.info());
				$.debug(e);
			}
			finally {
				track[this.id] = false;
			}
		}
	}),*/

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
	},

	wrapMethods: $.once(function()
	{
		var self = this;

		$.each(self, function(key, method)
		{
			if($.isFunction(method) && self.hasOwnProperty(key)) {
				self[key] = function()
				{
					var args = [self].concat([].slice.call(arguments));
					return self.run(function()
					{
						return method.apply(this, args);
					});
				};
			}
		});
	})
};
