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
			return name in data || arguments.length === 1 ? data[name] : (data[name] = value);
		};
	})()
};

bolanderi.get('BOLANDERI_VERSION', '@BOLANDERI_VERSION@');
bolanderi.get('PROJECT_VERSION', '@PROJECT_VERSION@');
bolanderi.get('DEBUG_MODE', eval('@PROJECT_DEBUG@'));

/*@PRE_CONTENT@*/

(function(jQuery, $)
{

bolanderi.$ = $;
// until now for opera 9
window['@PROJECT_NAME_SHORT@'] = bolanderi;

/*@CONTENT@*/

bolanderi.init();

})(jQuery, jQuery.noConflict(true));

})();
