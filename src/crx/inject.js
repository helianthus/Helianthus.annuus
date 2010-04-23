if(/@PROJECT_TARGET_REGEX@/i.test(location.href))
{
	chrome.extension.sendRequest(true, function(status)
	{
		if(!status) return;

		var head = document.getElementsByTagName('head');
		var script = document.createElement('script');

		script.src = chrome.extension.getURL("@PROJECT_NAME_SHORT@.js");

		(function inject()
		{
			head[0] ? head[0].appendChild(script) : setTimeout(inject, 50);
		})();
	});
}