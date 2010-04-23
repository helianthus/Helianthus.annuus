(function(undefined)
{

if (window["@PROJECT_NAME@"]) {
	return alert('@PROJECT_NAME@ has already loaded!');
}

window["@PROJECT_NAME@"] = true;

var bolanderi = {
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
bolanderi.get('DEBUG_MODE', false);

/*@CONTENT@*/

$(bolanderi).trigger('init');

})();
