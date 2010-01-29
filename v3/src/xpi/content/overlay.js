window.addEventListener('load', function()
{
	var pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBranch('extensions.annuus.');
	var status = pref.getBoolPref('switchedOn');
	var overlay = document.getElementById('annuus-overlay');
	var rHKGolden = /^http:\/\/forum\d+\.hkgolden\.com/i;

	function setStatus()
	{
		overlay.setAttribute('status', status ? 'on' : 'off');
	}

	setStatus();

	overlay.addEventListener('mouseup', function()
	{
		status = !status;
		setStatus();
		pref.setBoolPref('switchedOn', status);
	}, false);

	document.getElementById('appcontent').addEventListener('DOMContentLoaded', function(event)
	{
		var doc = event.originalTarget;
		if(status && doc.nodeName == '#document' && rHKGolden.test(doc.location.href))
		{
			var script = doc.createElement('script');
			script.charset = 'utf-8';
			script.src = 'resource://annuus/annuus.js';
			doc.getElementsByTagName('head')[0].appendChild(script);
		}
	}, false);

	gBrowser.addProgressListener({
		onLocationChange: function(progress, request, uri)
		{
			overlay.setAttribute('hidden', !(uri && rHKGolden.test(uri.prePath)));
		},
		onStateChange: function(){},
		onProgressChange: function(){},
		onStatusChange: function(){},
		onSecurityChange: function(){}
	}, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
}, false);