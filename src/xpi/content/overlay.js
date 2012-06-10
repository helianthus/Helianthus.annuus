window.addEventListener('load', function()
{
	var pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBranch('extensions.annuus.');
	var status = pref.getBoolPref('status');
	var overlay = document.getElementById('annuus-overlay');
	var rTarget = /\.hkgolden\.com$/i;
	var noop = function(){};

	gBrowser.addProgressListener({
		onLocationChange: function(progress, request, uri)
		{
			overlay.hidden = !rTarget.test(gBrowser.currentURI.prePath);
		},
		onStateChange: noop,
		onProgressChange: noop,
		onStatusChange: noop,
		onSecurityChange: noop
	});

	overlay.addEventListener('command', function()
	{
		status = !status;
		pref.setBoolPref('status', status);
		setStatus();
	}, false);

	var event = document.createEvent('Event');
	event.initEvent('annuus_status_change', false, false);

	function setStatus()
	{
		overlay.src = status ? 'chrome://annuus/skin/status-on.png' : 'chrome://annuus/skin/status-off.png';
		event.status = status;
		document.dispatchEvent(event);
	}

	setStatus();
}, false);
