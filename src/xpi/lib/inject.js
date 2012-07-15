(function()
{
	var rTarget = /\.hkgolden\.com$/i;
	var id = 'annuus-script-v3';

	function injectScript(doc)
	{
		if(!(rTarget.test(doc.location.hostname) && !doc.getElementById(id))) {
			return;
		}

		var head = doc.getElementsByTagName('head');
		var script = doc.createElement('script');

		script.id = id;
		script.charset = 'UTF-8';
		script.src = 'resource://annuus/annuus.js';

		(function inject()
		{
			head[0] ? head[0].appendChild(script) : doc.defaultView.setTimeout(inject, 50);
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

	var eventListener = function(event)
	{
		var doc = event.target;
		if(doc.nodeType === 9 && doc.defaultView.frameElement) {
			injectScript(doc);
		}
	};

	var updateWindow = function(window, enabled)
	{
		var content = window.document.getElementById('content');
		content[enabled ? 'addTabsProgressListener' : 'removeTabsProgressListener'](progressListener);
		content[enabled ? 'addEventListener' : 'removeEventListener']('DOMContentLoaded', eventListener, false);
	};

	var windowListener = {
		onOpenWindow: function(window)
		{
			window = window.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal);

            window.addEventListener('load', function onload()
			{
				window.removeEventListener('load', onload, false);

				if(window.document.documentElement.getAttribute('windowtype') === 'navigator:browser') {
					updateWindow(window, true);
				}
			}, false);
		},
		onWindowTitleChange: noop,
		onCloseWindow: noop
	};

	exports.setEnabled = function(enabled)
	{
		var windows = Services.wm.getEnumerator('navigator:browser');

		while(windows.hasMoreElements()) {
			updateWindow(windows.getNext().QueryInterface(Ci.nsIDOMWindow), enabled);
		}

		Services.wm[enabled ? 'addListener' : 'removeListener'](windowListener);
	};
})();
