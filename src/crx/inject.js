if(!document.getElementById('annuus') && /forum\d+\.hkgolden\.com/.test(location.href))
{
	var
	head = document.getElementsByTagName('head'),
	script = document.createElement('script');

	script.id = 'annuus-script-v3';
	script.charset = 'utf-8';
	script.src = chrome.extension.getURL("annuus.js");

	(function append()
	{
		head[0] ? head[0].appendChild(script) : setTimeout(append, 50);
	})();
}