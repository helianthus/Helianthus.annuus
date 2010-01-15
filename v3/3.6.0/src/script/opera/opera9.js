if(window.opera && window.opera.version && window.opera.version() < 10 && arguments.length == 0)
{
	return (function(callee)
	{
		window.opera.addEventListener('AfterScript', function()
		{
			window.opera.removeEventListener('AfterScript', arguments.callee, false);
			callee.call(window, null);
		}, false);
	})(arguments.callee);
}