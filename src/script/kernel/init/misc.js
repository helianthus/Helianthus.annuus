an.addModules = function(getModules)
{
	$(an).one('kernelready', function(){ $.extend(an.get('MODULES', {}), getModules()); });
};

$(function()
{
	$('script').empty().each(function()
	{
		this.removeAttribute('src');
	});
});