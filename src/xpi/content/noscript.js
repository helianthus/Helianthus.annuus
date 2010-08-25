(function()
{
	var whitelist = ['helianthus-annuus.googlecode.com'];

	document.addEventListener('@PROJECT_NAME_SHORT@_status_change', function(event)
	{
		if(event.status && '@maone.net/noscript-service;1' in Components.classes) {
		  var ns = Components.classes['@maone.net/noscript-service;1'].getService().wrappedJSObject.setJSEnabled(whitelist, true);
		}
	}, false);
})();
