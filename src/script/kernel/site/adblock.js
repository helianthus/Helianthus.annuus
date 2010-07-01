document.addEventListener && (function()
{
	var keywords = /pixel-?hk|imrworldwide|google-analytics|googlesyndication|_getTracker|(?:Page|Inline|Google|\b)[Aa]ds?\b/;

	(window.opera || document).addEventListener(window.opera ? 'BeforeScript' : 'beforeload', function(event)
	{
		if(keywords.test(event.url || event.element.src || event.element.text)) {
			event.preventDefault();
		}
	}, true);
})();
