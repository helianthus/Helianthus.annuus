window.addEventListener('load', function()
{
	var pref = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBranch('extensions.annuus.');  
	var status = pref.getBoolPref('switchedOn');
	var eOverlay = document.getElementById('annuus-overlay');
	var rHKGolden = /^http:\/\/forum\d+\.hkgolden\.com/i;
	
	function setStatus()
	{
		eOverlay.setAttribute('status', status ? 'on' : 'off');
	}
	
	setStatus();
	
	eOverlay.addEventListener('mouseup', function()
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
			var s = doc.createElement('script');
			s.setAttribute('src', 'resource://annuus/annuus.js');
			doc.getElementsByTagName('head')[0].appendChild(s);
		}
	}, false);
	
	gBrowser.addProgressListener({
		onLocationChange: function(progress, request, uri)
		{
			eOverlay.setAttribute('hidden', !(uri && rHKGolden.test(uri.prePath)));
		},
		onStateChange: function(){},
		onProgressChange: function(){},
		onStatusChange: function(){},
		onSecurityChange: function(){}
	}, Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
}, false);