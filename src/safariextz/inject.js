if(/\.hkgolden\.com$/.test(location.hostname))
{
	var head = document.getElementsByTagName('head');
	var script = document.createElement('script');

	script.charset = 'utf-8';
	script.src = safari.extension.baseURI + 'annuus.js';

	(function inject()
	{
		head.length ? head[0].appendChild(script) : setTimeout(inject, 50);
	})();
}
