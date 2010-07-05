(function(undefined)
{

if(window['@PROJECT_NAME_SHORT@'] && typeof window['@PROJECT_NAME_SHORT@'].get === 'function') {
	return alert('@PROJECT_NAME@ has already loaded!');
}

var bolanderi = window['@PROJECT_NAME_SHORT@'] = {
	get: (function()
	{
		var data = {};
		return function(name, value)
		{
			return name in data || arguments.length === 1 ? data[name] : (data[name] = value);
		};
	})()
};

bolanderi.get('VERSION', '@PROJECT_VERSION@');
bolanderi.get('DEBUG_MODE', eval('@PROJECT_DEBUG@'));

/*@PRE_CONTENT@*/

(function(jQuery, $)
{

bolanderi.$ = $;

/*@CONTENT@*/

$(bolanderi).trigger('init');

})(jQuery, jQuery.noConflict(true));

})();
