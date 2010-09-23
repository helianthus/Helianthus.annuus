(function()
{
	var whitelist = ['helianthus-annuus.googlecode.com'];

	window.addEventListener('load', function(event)
	{
		if('@maone.net/noscript-service;1' in Components.classes) {
			Components.classes['@maone.net/noscript-service;1'].getService().wrappedJSObject.setJSEnabled(whitelist, true);
		}
	}, false);
})();
