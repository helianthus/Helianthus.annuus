if(window.opera && window.opera.addEventListener)
{
	var blockScripts = function(event)
	{
		if(/pixelinteractivemedia|imrworldwide|google-analytics|_getTracker|\(ads|InlineAd|PageAd|GoogleAd|google_ad/.test(event.element.text)
		|| /pagead|imrworldwide/.test(event.element.src) && !/common.js$/.test(event.element.src)
		) event.preventDefault();
	};

	window.opera.addEventListener('BeforeScript', blockScripts, false);
	window.addEventListener('DOMContentLoaded', function()
	{
		window.opera.removeEventListener('BeforeScript', blockScripts, false);
	}, false);
}