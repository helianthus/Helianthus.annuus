$.extend(an.plugins, {

'8be1ac06-030a-42d4-a8f4-f2b7f4881300':
{
	desc: '改變引用風格',
	page: { 32: on },
	type: 8,
	options: {
		quoteStyle: { desc: '引用風格', type: 'select', choices: ['預設', '復古', '現代'], defaultValue: '預設' },
		quoteMaskLevel: { desc: '引用屏蔽層級', type: 'text', defaultValue: 2 }
	},
	queue: [{
		fn: function(job)
		{
			$.ss('.repliers_right blockquote + br { display: none; }');

			var
			styleNo = this.styleNo = $.inArray(job.options('quoteStyle'), job.plugin.options.quoteStyle.choices),
			jButton;

			switch(styleNo) {
				case 0:
					$.ss('\
					.repliers_right blockquote { margin: 0 0 8px 1px; padding: 0 0 7px 40px; } \
					blockquote.an-hiddenquote { padding-left: 0; } \
					.an-hiddenquote:before { content: url('+ an.resources['balloon--plus'] +'); } \
					.an-hiddenquote > div { display: none; } \
					');

					jButton = $('<img />').hoverize('.repliers_right blockquote').bind({
						'mouseover mouseout': function(event)
						{
							var jTarget = jButton.data('hoverize').jTarget;
							jTarget.css('outline', event.type === 'mouseout' || jTarget.hasClass('an-hiddenquote') ? '0' : '1px dashed gray');
						},
						entertarget: function()
						{
							jButton.attr('src', an.resources[jButton.data('hoverize').jTarget.hasClass('an-hiddenquote') ? 'balloon--plus' : 'balloon--minus']);
						}
					});
				break;
				case 1:
					$.ss('\
					.an-quotetogglebutton { margin: -18px 0 0 -4px; } \
					.an-quotetogglebutton, blockquote:before { color: #999; } \
					.repliers_right blockquote:before { content: ""; position: absolute; width: 20px; height: 20px; top 0; left: -4px; margin-top: -18px; } \
					.repliers_right td > blockquote { margin: 15px 0 10px 3px; } \
					.repliers_right blockquote { position: relative; margin: 0 0 10px 0; } \
					.repliers_right blockquote > div { border-left: 2px solid #999; padding-left: 5px; } \
					blockquote.an-hiddenquote:before { content: "+"; } \
					.an-hiddenquote > div > blockquote { display: none; } \
					');

					jButton = $('<span class="an-quotetogglebutton"></span>').hoverize('blockquote', { filter: ':has(blockquote)' })
					.bind('entertarget', function()
					{
						jButton.text(jButton.data('hoverize').jTarget.hasClass('an-hiddenquote') ? '+' : '--');
					});
				break;
				case 2:
					$.ss('\
					.an-quotetogglebutton { margin: 2px 0 0 -15px; font-weight: bold; } \
					.an-quotetogglebutton, blockquote:before, .an-hiddenquote:after { font-size: 12px; color: {0.sMainHeaderFontColor}; } \
					.repliers_right blockquote:before { content: "引用:"; display: block; margin-bottom: 2px; padding-left: 3px; line-height: 1.3; background-color: {0.sMainHeaderBgColor}; } \
					.repliers_right td > blockquote { border-right-width: 1px; } \
					.repliers_right blockquote { margin: 0 0 5px 0; border: 1px solid {0.sMainBorderColor}; border-right-width: 0; } \
					.repliers_right blockquote > div { padding: 0 0 5px 2px; } \
					.an-hiddenquote { position: relative; } \
					.an-hiddenquote:after { content: "＋"; position: absolute; top: 1px; right: 3px; font-weight: bold; } \
					.an-hiddenquote > div > blockquote { display: none; } \
					',
					$.options()
					);

					jButton = $('<span class="an-quotetogglebutton"></span>').hoverize('blockquote', { filter: ':has(blockquote)', autoPosition: false })
					.bind('entertarget', function()
					{
						var jTarget = jButton.data('hoverize').jTarget,
						offset = jTarget.offset();

						jButton.text(jTarget.hasClass('an-hiddenquote') ? '＋' : '－').css({ top: offset.top, left: offset.left + jTarget.width() });
					});
				break;
			}

			jButton.click(function()
			{
				jButton.data('hoverize').jTarget.toggleClass('an-hiddenquote');
			});
		}
	},
	{
		type: 2,
		fn: function(job)
		{
			var level = job.options('quoteMaskLevel') - (this.styleNo === 0 ? 1 : 2);
			if(level < 0) return;

			$j.replies().jContents
			.find(this.styleNo === 0 ? 'blockquote' : 'blockquote:has(blockquote)')
			.filter(function(){ return $(this).parentsUntil('td', 'blockquote').length === level; })
			.addClass('an-hiddenquote');
		}
	}]
}

});