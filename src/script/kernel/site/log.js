$(document).one('kernel_init', function()
{
	bolanderi.log('log', 'Helianthus.bolanderi - v{0} - by project.helianthus', annuus.get('BOLANDERI_VERSION'));
	bolanderi.log('log', 'Helianthus.annuus - v{0} - by project.helianthus', annuus.get('PROJECT_VERSION'));
});

(function()
{

var messages = {
	document_end: 'DOM is ready.',
	job_start: '{1.title}: {0.info()}',
	kernel_init: 'initalizing kernel...',
	kernel_ready: 'kernel is ready.',
	service_start: '{0.title}: initializing...',
	service_end: '{0.title}: initialization complete.',
	service_extend: '{0.title}: service extended.',
	storage_ready: 'storage is ready.',
	window_end: 'window is loaded.',
	work: 'work() triggered.'
};

var types = [];
$.each(messages, function(type)
{
	types.push(type);
});

$(document)
.bind(types.join(' '), function(event)
{
	annuus.log.apply(null, ['log', messages[event.type]].concat([].slice.call(arguments, 1)));
});

$(document).bind('debug', function(event, msg)
{
	annuus.log('debug', '$.debug: ' + msg);
});

})();
