window.addEventListener('load', function()
{
	var pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBranch('extensions.@PROJECT_NAME_SHORT@.');
	var status = pref.getBoolPref('status');
	var overlay = document.getElementById('@PROJECT_NAME_SHORT@-overlay');
	var rTarget = /@PROJECT_TARGET_REGEX@/i;
	var noop = function(){};
	var event = document.createEvent('Event');
	event.initEvent('AnnuusStatusChange', false, false);

	function setStatus()
	{
		overlay.src = status ? 'chrome://@PROJECT_NAME_SHORT@/skin/status-on.png' : 'chrome://@PROJECT_NAME_SHORT@/skin/status-off.png';
		event.status = status;
		document.dispatchEvent(event);
	}
	setStatus();

	overlay.addEventListener('command', function()
	{
		status = !status;
		pref.setBoolPref('status', status);
		setStatus();
	}, false);

	gBrowser.addProgressListener({
		onLocationChange: function(progress, request, uri)
		{
			overlay.hidden = !(uri && rTarget.test(uri.spec));
		},
		onStateChange: noop,
		onProgressChange: noop,
		onStatusChange: noop,
		onSecurityChange: noop
	});

	gBrowser.addTabsProgressListener({
		onLocationChange: function(browser, progress, request, uri)
		{
			if(progress.isLoadingDocument && status && rTarget.test(uri.spec))
			{
				var doc = browser.contentDocument;
				var head = doc.getElementsByTagName('head');
				var script = doc.createElement('script');

				script.id = '@PROJOECT_NAME_SHORT@-script';
				script.src = 'resource://@PROJECT_NAME_SHORT@/@PROJECT_NAME_SHORT@.js';

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
