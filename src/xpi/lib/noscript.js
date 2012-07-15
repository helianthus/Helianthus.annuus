(function()
{
	var whitelist = ['helianthus-annuus.googlecode.com'];

	exports.enableJS = function()
	{
		if('@maone.net/noscript-service;1' in Cc) {
			Cc['@maone.net/noscript-service;1'].getService().wrappedJSObject.setJSEnabled(whitelist, true);
		}
	};
})();
