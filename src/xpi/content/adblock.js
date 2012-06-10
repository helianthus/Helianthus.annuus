(function()
{
	var referrer = /hkgolden\.com/i;
	var keywords = /bmediaasia|pixel-?hk|imrworldwide|googlesyndication|_getTracker|(?:Page|Inline|Google|\b)[Aa]ds?\b|scorecardresearch|addthis/;
	var observer = {
		observe: function(subject) {
			subject.QueryInterface(Components.interfaces.nsIHttpChannel);
			if(subject.referrer && referrer.test(subject.referrer.spec) && keywords.test(subject.URI.spec)) {
				subject.cancel(Components.results.NS_ERROR_ABORT);
			}
		}
	};

	document.addEventListener('annuus_status_change', function(event)
	{
		Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService)[event.status ? 'addObserver' : 'removeObserver'](observer, "http-on-modify-request", false);
	}, false);
})();
