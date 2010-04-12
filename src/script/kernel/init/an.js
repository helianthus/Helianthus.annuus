(function()
{

function runUntil(until)
{
	do {
		var group = an.__jobGroups[an.__curPriority];

		$(an).trigger($.format('p{0}start', an.__curPriority));

		for(var i=0; i<group.length; ++i) {
			var job = group[i];
			if(job.fnSet.freq === once) group.splice(i--, 1);

			an.__curJob = job;

			$(an).trigger('jobstart', [job]);

			try {
				job.fnSet.js(job);
			}
			catch(e) {
				$.debug($.format('發生錯誤: {0}', job.task.desc), e, job, $j);
			}

			$(an).trigger('jobend', [job]);
		}

		$(an).trigger($.format('p{0}end', an.__curPriority));
	}
	while(++an.__curPriority <= until);
}

$.fn.an = function()
{
	$j = this;
	an.__curPriority = 1;

	$(an).trigger('anlevel1');

	runUntil(3);

	$(an).one('anlevel2', function()
	{
		runUntil(6);

		$(an).one('anlevel3', function()
		{
			runUntil(9);

			$.debug('an() completed successfully.');
		});

		if(an.get('WINDOW_IS_LOADED')) $(an).trigger('anlevel3');
	});

	if(an.get('DOM_IS_READY')) $(an).trigger('anlevel2');

	return $j;
};

$(an).one('storageready', function()
{
	$.timeout('checkDOM', function()
	{
		if($.isReady || $('#Side_GoogleAd').length) {
			an.get('DOM_IS_READY', true);
			$(an).trigger('anlevel2');
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
		$(an).trigger('anlevel3');
	}, 10);
});

})();