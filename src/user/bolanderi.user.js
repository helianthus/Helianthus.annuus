if(/@PROJECT_TARGET_REGEX@/i.test(location.href)) {
	(function(encodedScriptContent)
	{
		var head = document.getElementsByTagName('head');
		var script = document.createElement('script');

		script.id = '@PROJECT_NAME_SHORT-script';
		//script.src = 'data:text/javascript;base64,' + encoded;
		script.appendChild(document.createTextNode(atob(encodedScriptContent)));

		(function inject()
		{
			head[0] ? head[0].appendChild(script) : setTimeout(inject, 50);
		})();
	})('@ENCODED_CONTENT@');
}
