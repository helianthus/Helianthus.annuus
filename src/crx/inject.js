if(/@PROJECT_TARGET_REGEX@/i.test(location.href))
{
	chrome.extension.sendRequest(true, function(status)
	{
		if(status) {
			var script = document.createElement('script');
			script.src = chrome.extension.getURL("@PROJECT_NAME_SHORT@.js");
			document.getElementsByTagName('head')[0].appendChild(script);
		}
	});
}
