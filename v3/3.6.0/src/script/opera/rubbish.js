if(window.opera && window.opera.addEventListener)
{
	var blockScripts = function(event)
	{
		if(event.element.src
		? /pagead|imrworldwide/.test(event.element.src)
		: /pixelinteractivemedia|imrworldwide|google-analytics|_getTracker|\(ads|InlineAd|PageAd|GoogleAd|google_ad/.test(event.element.text)
		) event.preventDefault();
	};

	window.opera.addEventListener('BeforeScript', blockScripts, false);
	window.addEventListener('DOMContentLoaded', function()
	{
		window.opera.removeEventListener('BeforeScript', blockScripts, false);
	}, false);
}