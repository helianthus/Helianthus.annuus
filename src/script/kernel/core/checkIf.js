$.each({
	missing: {
		message: 'property "{0}" not found.',
		method: 'any',
		filter: function(target, name)
		{
			return !(name in target);
		}
	},
	exist: {
		message: 'property "{0}" already exists.',
		method: 'any',
		filter: function(target, name)
		{
			return name in target;
		}
	},
	unknown: {
		message: 'unknown value "{0}" encountered.',
		method: 'all',
		param: 'target',
		filter: function(target, value)
		{
			return target !== value;
		}
	},
	wrongType: {
		message: 'unsupported type "{0}" encountered.',
		method: 'all',
		filter: function(target, value)
		{
			if(value !== 'mixed') {
				switch(value) {
					case 'array': return !$.isArray(target);
					case 'function': return !$.isFunction(target);
					default: return typeof target !== value;
				}
			}
		}
	}
}, function(name, data)
{
	(bolanderi.checkIf || (bolanderi.checkIf = {}))[name] = function(target, refs, info)
	{
		var val;
		var result = $[data.method]([].concat(refs), function(i, value)
		{
			val = data.param === 'target' ? target : value;
			return data.filter(target, value);
		});

		if(result) {
			info = info || target;
			bolanderi.log('error', '{0}{1|} [{2}]', $.format(data.message, val + ''), info instanceof bolanderi.Job && ' task dropped.', bolanderi.info(info));
		}

		return result;
	};
});
