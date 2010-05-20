$(bolanderi).one('init', function()
{

var mode = $.cookie('an_storagemode') || 'localStorage';

if(mode === 'localStorage' && !window.localStorage || mode === 'sessionStorage' && !window.sessionStorage) {
	mode = 'flash';
}

if(mode === 'flash') {
	bolanderi.get('FLASH_API', $('<div />', { id: 'bolanderi-lso' }).appendTo('#an').toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.time() : ''))[0]);
}

$(bolanderi).trigger('kernelready');

function init()
{
	bolanderi.__storage.mode(mode);

	// *** REMOVE ME *** //
	bolanderi.__storage.clear();

	$(bolanderi).trigger('storageready');
	$(document).work();
}

$.timeout('checkStorage', [100], function(countdown)
{
	switch(mode) {
		case 'flash':
			if(typeof bolanderi.get('FLASH_API').get !== 'function') {
				break;
			}
		case 'localStorage':
		case 'sessionStorage':
		case 'null':
			return init();
	}

	if(countdown) {
		$.timeout('checkStorage', 50, [--countdown]);
	}
	else {
		mode = window.localStorage ? 'localStorage' : 'null';
		init();
	}
});

});
