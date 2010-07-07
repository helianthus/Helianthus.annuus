$(document)
.bind('init kernelready storageready work document_end window_end', function(event)
{
	$.log('log', {
		init: 'initalizing kernel...',
		kernelready: 'kernel is ready.',
		storageready: 'storage is ready.',
		work: 'work() triggered.',
		document_end: 'DOM is ready.',
		window_end: 'window is loaded.'
	}[event.type]);
})
.bind('servicestart serviceend jobstart', function(event, job)
{
	$.log('log', {
		servicestart: 'initializing service: {0}',
		serviceend: 'initialization complete: {0}',
		jobstart: 'executing job: {0}'
	}[event.type], job.info());
});
