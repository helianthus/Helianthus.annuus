(function(encoded)
{
	var
	head = document.getElementsByTagName('head'),
	script = document.createElement('script');

	script.id = 'annuus-script-v3';
	script.appendChild(document.createTextNode(atob(encoded)));

	(function append()
	{
		head[0] ? head[0].appendChild(script) : setTimeout(append, 50);
	})();
})('${ENCODED_SCRIPT_CONTENT}');
