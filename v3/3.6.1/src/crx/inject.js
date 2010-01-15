if(/forum\d+\.hkgolden\.com/.test(location.href) && !document.getElementById('helianthus-annuus'))
{
	var script = document.createElement('script');
	script.id = 'helianthus-annuus';
	script.src = chrome.extension.getURL("annuus.js");

	var head = document.getElementsByTagName('head');
	
	(function()
	{
		head[0] ? head[0].appendChild(script) : setTimeout(arguments.callee, 50);
	})();
}