(function(undefined)
{

if (window.jQuery) {
	return alert('jQuery already exists! Probably caused by duplicate script injection.');
}

var $d, $j, an;

an = window.an = {
	tasks: {}
};

(function()
{
	var data = {};
	an.get = function(name, value)
	{
		if(typeof value === 'undefined') {
			return data[name];
		}

		if(!(name in data)) {
			data[name] = value;
		}

		return an;
	};
})();

an.get('VERSION', '${AN_VERSION}');

/*@CONTENT@*/

$d = $(document);

$(an).trigger('kernelready').trigger('tasksready');

(function()
{
	function init()
	{
		// *** REMOVE ME *** //
		$.storage(null);

		$(an).trigger('storageready');

		$d.an();
	}

	if(an.storageMode === 'DOM') {
		init();
	}
	else {
		an.get('FLASH_API', $('<div />', { id: 'an-lso' }).appendTo('#an').toFlash('http://helianthus-annuus.googlecode.com/svn/other/lso.swf' + ($.browser.msie ? '?' + $.time() : ''))[0]);

		$.timeout('checkStorage', function()
		{
			typeof an.get('FLASH_API').get === 'function' ? init() : $.timeout('checkStorage', 50);
		});
	}
})();

})();
