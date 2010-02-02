window.addEventListener('load', function()
{
	var
	pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBranch('extensions.annuus.'),
	status = pref.getBoolPref('status'),
	overlay = document.getElementById('annuus-overlay'),
	rHKG = /^http:\/\/forum\d+\.hkgolden\.com/i,
	noop = function(){};

	function setStatus()
	{
		overlay.src = status ? 'chrome://annuus/skin/status-on.png' : 'chrome://annuus/skin/status-off.png';
	}
	setStatus();

	overlay.addEventListener('command', function()
	{
		status = !status;
		setStatus();
		pref.setBoolPref('status', status);
	}, false);

	gBrowser.addProgressListener({
		onLocationChange: function(browser, progress, request, uri)
		{
			if(uri) overlay.hidden = !rHKG.test(uri.prePath);
		},
		onStateChange: noop,
		onProgressChange: noop,
		onStatusChange: noop,
		onSecurityChange: noop
	});

	gBrowser.addTabsProgressListener({
		onLocationChange: function(browser, progress, request, uri)
		{
			if(progress.isLoadingDocument && status && rHKG.test(uri.prePath)) {
				var
				doc = browser.contentDocument,
				script = doc.createElement('script');
				script.charset = 'utf-8';
				script.src = 'resource://annuus/annuus.js';
				doc.getElementsByTagName('head')[0].appendChild(script);
			}
		},
		onStateChange: noop,
		onProgressChange: noop,
		onStatusChange: noop,
		onSecurityChange: noop
	});
}, false);