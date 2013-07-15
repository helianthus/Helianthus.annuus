(function(encoded)
{
	var
	script = document.createElement('script');

	script.id = 'annuus-script-v3';
	script.appendChild(document.createTextNode(atob(encoded)));

	(function append()
	{
		document.documentElement ? document.documentElement.appendChild(script) : setTimeout(append, 50);
	})();
})('${ENCODED_SCRIPT_CONTENT}');
