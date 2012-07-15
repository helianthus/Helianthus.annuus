(function()
{
	var referrer = /hkgolden\.com/i;
	var keywords = /bmediaasia|pixel-?hk|imrworldwide|googlesyndication|_getTracker|(?:Page|Inline|Google|\b)[Aa]ds?\b|scorecardresearch|addthis/;
	var observer = {
		observe: function(subject) {
			subject.QueryInterface(Ci.nsIHttpChannel);
			if(subject.referrer && referrer.test(subject.referrer.spec) && keywords.test(subject.URI.spec)) {
				subject.cancel(Components.results.NS_ERROR_ABORT);
			}
		}
	};

	exports.setEnabled = function(enabled)
	{
		Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService)[enabled ? 'addObserver' : 'removeObserver'](observer, "http-on-modify-request", false);
	};
})();
