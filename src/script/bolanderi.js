(function(undefined)
{

if (window['@PROJECT_NAME_SHORT@']) {
	return alert('@PROJECT_NAME@ has already loaded!');
}

var bolanderi = window['@PROJECT_NAME_SHORT@'] = {
	get: (function()
	{
		var data = {};
		return function(name, value)
		{
			if(typeof value !== 'undefined' && !(name in data)) {
				data[name] = value;
			}
			return data[name];
		};
	})()
};

bolanderi.get('VERSION', '@PROJECT_VERSION@');
bolanderi.get('DEBUG_MODE', eval('@PROJECT_DEBUG@'));

/*@CONTENT@*/

$(bolanderi).trigger('init');

})();