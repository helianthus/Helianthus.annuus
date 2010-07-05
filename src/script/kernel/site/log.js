$(bolanderi)
.bind('init kernelready storageready workstart workend document_end window_loaded', function(event)
{
	$.log('log', {
		init: 'initalizing...',
		kernelready: 'kernel is ready.',
		storageready: 'storage is ready.',
		workstart: 'work() begins.',
		workend: 'work() completed sucessfully.',
		document_end: 'DOM is ready.',
		window_loaded: 'window is loaded.'
	}[event.type]);
})
.bind('groupstart groupend', function(event, groupNo)
{
	$.log('log', 'group {0} {1}.', groupNo, event.type === 'groupstart' ? 'begins' : 'ends');
})
.bind('jobstart', function(event, job, groupNo)
{
	$.log('log', 'executing job: {0}', job.info());
});
