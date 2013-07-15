if(!document.getElementById('annuus') && /\.hkgolden\.com$/.test(location.hostname))
{
	var
	script = document.createElement('script');

	script.id = 'annuus-script-v3';
	script.charset = 'utf-8';
	script.src = chrome.extension.getURL("annuus.js");

	(function append()
	{
		document.documentElement ? document.documentElement.appendChild(script) : setTimeout(append, 50);
	})();
}
