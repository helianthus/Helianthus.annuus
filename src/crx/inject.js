if(/^http:\/\/forum\d+\.hkgolden\.com/i.test(location.href))
{
	chrome.extension.sendRequest('isHKG', function(status)
	{
		if(!status) return;

		var
		head = document.getElementsByTagName('head'),
		script = document.createElement('script');

		script.charset = 'utf-8';
		script.src = chrome.extension.getURL("annuus.js");

		(function append()
		{
			head[0] ? head[0].appendChild(script) : setTimeout(append, 50);
		})();
	});
}