bolanderi.addModules = function(getModules)
{
	$(bolanderi).one('kernelready', function(){ $.extend(bolanderi.get('MODULES', {}), getModules()); });
};

$(function()
{
	$('script').empty().each(function()
	{
		this.removeAttribute('src');
	});
});
