$.extend(an.plugins, {

'fc07ccda-4e76-4703-8388-81dac9427d7c':
{
	desc: '強制顯示空白用戶名連結',
	pages: { on: [view] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.ss('.an-nameforcedshown:before { content: "<空白名稱>"; font-style: italic; }');
		}
	},
	{
		type: always,
		fn: function(job)
		{
			$j.replies().jNameLinks.filter(function(){ return $(this).width() === 0; }).addClass('an-nameforcedshown');
		}
	}]
},

'63333a86-1916-45c1-96e0-f34a5add67c1':
{
	desc: '限制回覆高度',
	pages: { off: [view] },
	type: 6,
	options: {
		replyMaxHeight: { desc: '最大高度(px)', type: 'text', defaultValue: 2000 }
	},
	queue: [{
		fn: function(job)
		{
			var maxHeight = job.options('replyMaxHeight');

			$.ss('\
			.repliers_right, .repliers_right > tbody, .repliers_right > tbody > tr, .repliers_right > tbody > tr > td { display: block; } \
			.repliers_right > tbody > tr:first-child { max-height: '+maxHeight+'px; overflow-y: hidden; } \
			.an-maxheightremoved > .repliers_right > tbody > tr:first-child { max-height: none; } \
			#an-heighttoggler { margin: -14px 0 0 3.5px; } \
			#an-heighttoggler > img { padding: 7px 3.5px; cursor: pointer; } \
			');

			var jButton = $('<div id="an-heighttoggler"><img src="'+an.resources['control-eject']+'" /><img src="'+an.resources['control-stop-270']+'" /><img src="'+an.resources['control-270']+'" /></div>')
			.hoverize('.repliers_left + td', {
				filter: function(){ return $(this).hasClass('an-maxheightremoved') || $(this).find('td:first').innerHeight() > maxHeight; },
				autoPosition: false
			})
			.bind({
				entertarget: function()
				{
					var jTarget = jButton.data('hoverize').jTarget,
					showFirst = jTarget.hasClass('an-maxheightremoved'),
					offset = jTarget.offset();

					jButton.css({ top: offset.top + jTarget.height(), left: offset.left }).children(':first').toggle(showFirst).nextAll().toggle(!showFirst);
				},
				click: function(event)
				{
					var data = jButton.data('hoverize');
					data.fixScroll = $(event.target).index() === 2 ? 'top' : 'bottom';
					data.fixScroll_difference = data.jTarget[data.fixScroll]() - $d.scrollTop();
					data.jTarget.toggleClass('an-maxheightremoved');
				}
			});
		}
	}]
}

});