bolanderi.init = function()
{

$.event.trigger('kernel_init');

$.run(function()
{
	if(!document.body) {
		return $.run(this, 50);
	}

	var root = $('#bolanderi');
	if(!root.length) {
		root = $('<div/>', { id: 'bolanderi' }).prependTo(document.body);
	}

	$('<div/>', { id: '@PROJECT_NAME_SHORT@' }).appendTo(root);

	var mode = $.cookie('@PROJECT_NAME_SHORT@_storage_mode') || 'localStorage';

	if(mode === 'localStorage' && !window.localStorage || mode === 'sessionStorage' && !window.sessionStorage) {
		mode = 'flash';
	}

	if(mode === 'flash') {
		bolanderi.get('FLASH_API', $('<div/>', { id: 'bolanderi-lso' }).appendTo(root).toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.now() : ''))[0]);
	}

	$.event.trigger('kernel_ready');

	function init()
	{
		bolanderi.storage.mode(mode);
		$.event.trigger('storage_ready');
		bolanderi.work(document);
	}

	$.run([100], function(countdown)
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
			$.run(this, 50, [--countdown]);
		}
		else {
			mode = window.localStorage ? 'localStorage' : 'null';
			init();
		}
	});
});

};
