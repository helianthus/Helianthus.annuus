bolanderi.init = function()
{

bolanderi.trigger('kernel_init');

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

	bolanderi.trigger('kernel_ready');
});

};
