if(/@PROJECT_TARGET_REGEX@/i.test(location.href))
{
	var script = document.createElement('script');
	script.id = '@PROJECT_NAME_SHORT@-script';
	script.src = safari.extension.baseURI + '@PROJECT_NAME_SHORT@.js';
	var head = document.getElementsByTagName('head');

	(function inject()
	{
		head.length ? head[0].appendChild(script) : setTimeout(inject, 50);
	})();
}
