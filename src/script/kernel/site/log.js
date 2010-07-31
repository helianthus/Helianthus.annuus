$(document).one('kernel_init', function()
{
	$.log('log', 'Helianthus.bolanderi - v{0} - by project.helianthus', annuus.get('BOLANDERI_VERSION'));
	$.log('log', 'Helianthus.annuus - v{0} - by project.helianthus', annuus.get('PROJECT_VERSION'));
});

(function()
{

var messages = {
	//cache_off: '$.rules: cache off.',
	//cache_on: '$.rules: cache on.',
	document_end: 'DOM is ready.',
	job_start: '{1.title}: {0}',
	kernel_init: 'initalizing kernel...',
	kernel_ready: 'kernel is ready.',
	service_start: 'initializing service: {0}',
	service_end: 'initialization complete: {0}',
	storage_ready: 'storage is ready.',
	window_end: 'window is loaded.',
	work: 'work() triggered.',
	work_window_start: 'work(): window_start.',
	work_document_start: 'work(): document_start.',
	work_document_end: 'work(): document_end.',
	work_window_end: 'work(): window_end.'
};

var types = [];
$.each(messages, function(type)
{
	types.push(type);
});

$(document)
.bind(types.join(' '), function(event, job)
{
	$.log.apply(null, ['log', messages[event.type], job instanceof bolanderi.Job && job.info()].concat([].slice.call(arguments, 2)));
});

})();
