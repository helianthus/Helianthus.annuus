(function()
{
	var rTarget = /\.hkgolden\.com$/i;
	var id = 'annuus-script';

	function injectScript(doc)
	{
		if(!(rTarget.test(doc.location.hostname) && !doc.getElementById(id))) {
			return;
		}

		var head = doc.getElementsByTagName('head');
		var script = doc.createElement('script');

		script.id = id;
		script.charset = 'utf-8';
		script.src = 'resource://annuus/annuus.js';

		(function inject()
		{
			head[0] ? head[0].appendChild(script) : setTimeout(inject, 50);
		})();
	}

	var noop = function(){};
	var progressListener = {
		onLocationChange: function(browser, progress, request, uri)
		{
			injectScript(browser.contentDocument);
		},
		onStateChange: noop,
		onProgressChange: noop,
		onStatusChange: noop,
		onSecurityChange: noop
	};

	// inject script into iframes
	// not good enough, any way to do it at document start?
	var eventListener = function(event)
	{
		var doc = event.target;
		if(doc.nodeType === 9 && doc.defaultView.frameElement != null) {
			injectScript(doc);
		}
	};

	document.addEventListener('annuus_status_change', function(event)
	{
		gBrowser[event.status ? 'addTabsProgressListener' : 'removeTabsProgressListener'](progressListener);
		gBrowser[event.status ? 'addEventListener' : 'removeEventListener']('DOMContentLoaded', eventListener, false);
	}, false);
})();
