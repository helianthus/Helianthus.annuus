(function(undefined)
{

if(window['@PROJECT_NAME_SHORT@'] && typeof window['@PROJECT_NAME_SHORT@'].get === 'function') {
	return alert('@PROJECT_NAME@ has already loaded!');
}

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
bolanderi.get('DEBUG_MODE', eval('@PROJECT_DEBUG@'));

/*@PRE_CONTENT@*/

(function(jQuery, $)
{

window['@PROJECT_NAME_SHORT@'] = bolanderi;
bolanderi.$ = $;

/*@CONTENT@*/

$(bolanderi).trigger('init');

})(jQuery, jQuery.noConflict(true));

})();
