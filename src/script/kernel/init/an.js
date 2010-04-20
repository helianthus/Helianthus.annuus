(function()
{

function execGroups(eventType)
{
	for(var groupNo = an.get('RUN_AT')[eventType], until = groupNo + $.len(an.get('PRIORITY')) - 1; groupNo <= until; ++groupNo) {
		var group = an.__jobGroups[groupNo];

		$(an).trigger('groupstart', [groupNo]);

		for(var i=0; i<group.length; ++i) {
			var job = group[i];

			if((job.__task.frequency || 'once') === 'once') {
				group.splice(i--, 1);
			}

			$(an).trigger('jobstart', [job, groupNo]);

			if(job.__task.css) {
				$.rules(job.__task.css);
			}

			if(job.__task.js) {
				$.notify('debug', 'executing {0}', job.__task.id);

				try {
					an.__api[job.__api].js(job);
				}
				catch(e) {
					$.debug('Error occurred: ' + job.__module.title, 'error:', e, 'job:', job, 'context:', job.context());
				}
			}

			$(an).trigger('jobend', [job, groupNo]);
		}

		$(an).trigger('groupend', [groupNo]);
	}
}

$.fn.an = function()
{
	an.__context = $(this[0]);

	$(an).trigger('document_start');

	execGroups('document_start');

	$(an).one('document_end', function()
	{
		execGroups('document_end');

		$(an).one('window_loaded', function()
		{
			execGroups('window_loaded');

			$.notify('info', 'an() completed successfully.');
		});

		if(an.get('WINDOW_IS_LOADED')) {
			$(an).trigger('window_loaded');
		}
	});

	if(an.get('DOM_IS_READY')) {
		$(an).trigger('document_end');
	}

	return this;
};

$(an).one('storageready', function()
{
	$.timeout('checkDOM', function()
	{
		if($.isReady || $('#Side_GoogleAd').length) {
			an.get('DOM_IS_READY', true);
			$(an).trigger('document_end');
		}
		else {
			$.timeout('checkDOM', 50);
		}
	});
});

$(window).one('load', function()
{
	setTimeout(function()
	{
		an.get('WINDOW_IS_LOADED', true);
		if(an.get('DOM_IS_READY')) {
			$(an).trigger('window_loaded');
		}
	}, 10);
});

})();