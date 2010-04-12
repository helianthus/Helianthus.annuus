window.addEventListener('load', function()
{
	var pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBranch('extensions.annuus.');
	var status = pref.getBoolPref('status');
	var overlay = document.getElementById('annuus-overlay');
	var rHKG = /^http:\/\/forum\d+\.hkgolden\.com\/(?:$|[a-z]+?\.(?:aspx|html))/i;
	var noop = function(){};

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
		onLocationChange: function(progress, request, uri)
		{
			overlay.hidden = !(uri && rHKG.test(uri.spec));
		},
		onStateChange: noop,
		onProgressChange: noop,
		onStatusChange: noop,
		onSecurityChange: noop
	});

	gBrowser.addTabsProgressListener({
		onLocationChange: function(browser, progress, request, uri)
		{
			if(progress.isLoadingDocument && status && rHKG.test(uri.spec))
			{
				var doc = browser.contentDocument;
				var head = doc.getElementsByTagName('head');
				var script = doc.createElement('script');

				script.src = 'resource://annuus/annuus.js';

				(function inject()
				{
					head[0] ? head[0].appendChild(script) : setTimeout(inject, 50);
				})();
			}
		},
		onStateChange: noop,
		onProgressChange: noop,
		onStatusChange: noop,
		onSecurityChange: noop
	});
}, false);
