window.addEventListener('load', function()
{
	var pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBranch('extensions.@PROJECT_NAME_SHORT@.');
	var status = pref.getBoolPref('status');
	var overlay = document.getElementById('@PROJECT_NAME_SHORT@-overlay');
	var rTarget = /@PROJECT_TARGET_REGEX@/i;
	var noop = function(){};

	gBrowser.addProgressListener({
		onLocationChange: function(progress, request, uri)
		{
			overlay.hidden = !rTarget.test(gBrowser.currentURI.spec);
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
	event.initEvent('@PROJECT_NAME_SHORT@_status_change', false, false);

	function setStatus()
	{
		overlay.src = status ? 'chrome://@PROJECT_NAME_SHORT@/skin/status-on.png' : 'chrome://@PROJECT_NAME_SHORT@/skin/status-off.png';
		event.status = status;
		document.dispatchEvent(event);
	}

	setStatus();
}, false);
