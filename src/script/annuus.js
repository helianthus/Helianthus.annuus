(function(undefined)
{

if (window.jQuery) {
	return alert('jQuery already exists! Probably caused by duplicate script injection.');
}

var an = window.an = {
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

an.get('VERSION', '${AN_VERSION}');
an.get('DEBUG_MODE', true);

/*@CONTENT@*/

$(an).trigger('init');

})();
