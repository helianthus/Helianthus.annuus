$(bolanderi).one('init', function()
{

if(bolanderi.get('STORAGE_MODE', $.cookie('an_storagemode') !== 'Flash' && window.localStorage && 'DOM' || 'Flash') === 'Flash') {
	bolanderi.get('FLASH_API', $('<div />', { id: 'bolanderi-lso' }).appendTo('#an').toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.time() : ''))[0]);
}

$(bolanderi).trigger('kernelready').trigger('modulesready');

function init()
{
	// *** REMOVE ME *** //
	bolanderi.__storage.clear();

	$(bolanderi).trigger('storageready');
	$(document).work();
}

$.timeout('checkStorage', function()
{
	bolanderi.get('STORAGE_MODE') !== 'Flash' || typeof bolanderi.get('FLASH_API').get === 'function' ? init() : $.timeout('checkStorage', 50);
});

});
