$(an).one('init', function()
{

if(an.get('STORAGE_MODE', $.cookie('an_storagemode') !== 'Flash' && Modernizr.localStorage && 'DOM' || 'Flash') === 'Flash') {
	an.get('FLASH_API', $('<div />', { id: 'an-lso' }).appendTo('#an').toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.time() : ''))[0]);
}

$(an).trigger('kernelready').trigger('modulesready');

function init()
{
	// *** REMOVE ME *** //
	an.__storage.clear();

	$(an).trigger('storageready');
	$(document).an();
}

$.timeout('checkStorage', function()
{
	an.get('STORAGE_MODE') !== 'Flash' || typeof an.get('FLASH_API').get === 'function' ? init() : $.timeout('checkStorage', 50);
});

});