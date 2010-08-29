(function()
{

var messages = {
	document_start: 'run_at event: document_start.',
	document_end: 'run_at event: document_end.',
	job_start: '{1.title}: {0.info()}',
	jobs_ready: 'jobs are ready.',
	kernel_init: 'initalizing kernel...',
	kernel_ready: 'kernel is ready.',
	service_start: '{0.title}: initializing...',
	service_ready: '{0.title}: service is ready.',
	service_extend: '{0.title}: service extended.',
	storage_ready: 'storage is ready.',
	window_start: 'run_at event: window_start.',
	window_end: 'run_at event: window_end.'
};

$(document)
.bind('debug', function(event, msg)
{
	annuus.log('debug', '$.debug: ' + msg);
})
.one('kernel_init', function()
{
	bolanderi.log('log', 'Helianthus.bolanderi - v{0} - by project.helianthus', annuus.get('BOLANDERI_VERSION'));
	bolanderi.log('log', 'Helianthus.annuus - v{0} - by project.helianthus', annuus.get('PROJECT_VERSION'));
})
.bind('bolanderi_event', function(event, type)
{
	if(type in messages) {
		annuus.log.apply(null, ['log', messages[type]].concat([].slice.call(arguments, 2)));
	}
});

})();
