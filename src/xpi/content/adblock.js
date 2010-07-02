(function()
{
	var referrer = /hkgolden\.com/i;
	var keywords = /pixel-?hk|imrworldwide|googlesyndication|_getTracker|(?:Page|Inline|Google|\b)[Aa]ds?\b/;
	var service = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	var observer = {
		observe: function(subject) {
			subject.QueryInterface(Components.interfaces.nsIHttpChannel);
			if(subject.referrer && referrer.test(subject.referrer.spec) && keywords.test(subject.URI.spec)) {
				subject.cancel(Components.results.NS_ERROR_ABORT);
			}
		}
	};

	document.addEventListener('AnnuusStatusChange', function(event)
	{
		service[event.status ? 'addObserver' : 'removeObserver'](observer, "http-on-modify-request", false);
	}, false);
})();
