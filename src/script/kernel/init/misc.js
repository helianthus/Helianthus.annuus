bolanderi.addModules = function(getModules)
{
	$(bolanderi).one('kernelready', function(){ $.extend(bolanderi.get('MODULES', {}), getModules()); });
};

bolanderi.get('RUN_AT', { document_start: 1, document_end: 4, window_loaded: 7 });
bolanderi.get('PRIORITY', { high: 0, normal: 1, low: 2 });

$(function()
{
	$('script').empty().each(function()
	{
		this.removeAttribute('src');
	});
});
