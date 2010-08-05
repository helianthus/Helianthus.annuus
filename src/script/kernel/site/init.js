bolanderi.init = function()
{

$.event.trigger('kernel_init');

$.timeout('checkbody', function()
{

if(!document.body) {
	return $.timeout('checkbody', 50);
}

$('<div/>', { id: 'an' }).prependTo(document.body);

var mode = $.cookie('an_storagemode') || 'localStorage';

if(mode === 'localStorage' && !window.localStorage || mode === 'sessionStorage' && !window.sessionStorage) {
	mode = 'flash';
}

if(mode === 'flash') {
	bolanderi.get('FLASH_API', $('<div/>', { id: 'bolanderi-lso' }).appendTo('#an').toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.now() : ''))[0]);
}

$.event.trigger('kernel_ready');

function init()
{
	bolanderi.storage.mode(mode);
	$.event.trigger('storage_ready');
	bolanderi.work(document);
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

};
