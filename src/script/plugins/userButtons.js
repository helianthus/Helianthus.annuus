(function($)
{
	var jUserButtons, recordOffset = function()
	{
		var data = jUserButtons.data('hoverize');
		data.fixScroll_difference = data.jTarget.top() - $d.scrollTop();
	};

	$.userButton = function(src)
	{
		if(!jUserButtons) {
			$.ss('\
			#an-userbuttons > img:first-child { padding-top: 7px; } \
			#an-userbuttons > img { display: block; padding: 3.5px 7px; cursor: pointer; } \
			');

			jUserButtons = $('<div id="an-userbuttons"></div>').hoverize('.repliers_left', { fixScroll: 'top', fixScroll_autoRecord: false }).bind({
				entertarget: function()
				{
					jUserButtons.children().data('userButton', { jTarget: jUserButtons.data('hoverize').jTarget.parent() }).trigger('buttonshow');
				},
				buttonshow: function(event)
				{
					event.stopPropagation();
				}
			});
		}

		return $('<img />', { src: src, click: recordOffset }).appendTo(jUserButtons);
	};
})(jQuery);

$.extend(an.plugins, {

'db770fdc-9bf5-46b9-b3fa-78807f242c3c':
{
	desc: '用戶封鎖功能',
	pages: { on: [view] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.ss('\
			.an-bammed-msg { color: #999; font-size: 10px; text-align: center; } \
			.an-bammed-msg > span { cursor: pointer; } \
			.an-bammed > td { opacity: 0.5; } \
			.an-bammed > .repliers_left > div > a:first-child ~ *, .an-bammed > td > .repliers_right { display: none; } \
			');

			var bamList = job.db('aBamList') || [],

			jButton = $.userButton().bind({
				click: function()
				{
					var userid = jButton.data('userButton').jTarget.attr('userid');
					var index = $.inArray(userid, bamList);
					index === -1 ? bamList.push(userid) : bamList.splice(index, 1);

					job.db('aBamList', bamList);
					toggleReplies(null);
				},
				buttonshow: function()
				{
					var isBammed = $.inArray(jButton.data('userButton').jTarget.attr('userid'), bamList) !== -1;
					jButton.attr('src', an.resources[isBammed ? 'tick-shield' : 'cross-shield']).siblings().toggle(!isBammed);
				}
			}),

			tempShown,
			jMsg = $('<div class="an-bammed-msg">( <span></span> )</div>').hoverize('.repliers_left + td', { autoToggle: false, autoPosition: false })
			.bind({
				entertarget: function()
				{
					var jTarget = jMsg.data('hoverize').jTarget;
					if(!jTarget.parent().hasClass('an-bammed')) return;

					var height = jTarget.innerHeight();

					jMsg
					.children().text('Show Blocked User - ' + jTarget.parent().attr('username')).end()
					.css($.extend(jTarget.offset(), { width: jTarget.innerWidth(), height: height, lineHeight: height + 'px' }))
					.show();
				},
				leavetarget: function()
				{
					jMsg.hide();

					if(tempShown) {
						tempShown = false;
						jMsg.data('hoverize').jTarget.parent().addClass('an-bammed');
					}
				},
				click: function(event)
				{
					if(event.target === this) return;

					tempShown = true;
					jMsg.hide().data('hoverize').jTarget.parent().removeClass('an-bammed');
				}
			});

			var toggleReplies = function(jScope)
			{
				(jScope || $(document)).replies().jInfos.each(function()
				{
					var jThis = $(this);
					jThis.toggleClass('an-bammed', $.inArray(jThis.attr('userid'), bamList) != -1);
				});
			};

			$.prioritize(always, function()
			{
				if(bamList.length) filterTopics($j);
			});
		}
	}]
},

'7906be8e-1809-40c1-8e27-96df3aa229d8':
{
	desc: '用戶高亮功能',
	pages: { on: [view] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var highlightList = $.state('highlight_id') || window.highlight_id && [window.highlight_id + ''] || [],

			jButton = $.userButton().bind({
				click: function()
				{
					var userid = jButton.data('userButton').jTarget.attr('userid');
					var index = $.inArray(userid, highlightList);
					index === -1 ? highlightList.push(userid) : highlightList.splice(index, 1);

					$.state('highlight_id', highlightList)

					toggleReplies(null);
				},
				buttonshow: function()
				{
					jButton.attr('src', an.resources[jButton.data('userButton').jTarget.hasClass('an-highlighted') ? 'highlighter--minus': 'highlighter--plus']);
				}
			});

			$.ss('\
			tr[userid] > td { background-color: {0.sSecBgColor} !important; } \
			tr.an-highlighted > td { background-color: {0.sHighlightBgColor} !important; } \
			',
			job.options());

			var toggleReplies = function(jScope)
			{
				(jScope || $(document)).replies().jInfos.each(function()
				{
					var jThis = $(this);
					jThis.toggleClass('an-highlighted', $.inArray(jThis.attr('userid'), highlightList) != -1);
				});
			};

			$.prioritize(always, function()
			{
				if(highlightList.length) toggleReplies($j);
			});
		}
	}]
},

'e82aa0ba-aa34-4277-99ea-41219dcdacf2':
{
	desc: '用戶單獨顯示功能',
	pages: { on: [view] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var
			targetId,
			jButton = $.userButton().bind({
				click: function()
				{
					targetId = targetId ? null : jButton.data('userButton').jTarget.attr('userid');
					toggleReplies(null);
				},
				buttonshow: function()
				{
					jButton.attr('src', an.resources[targetId ? 'magnifier-zoom-out' : 'magnifier-zoom-in']);
				}
			}),
			toggleReplies = function(jScope)
			{
				(jScope || $(document)).replies().jInfos.each(function()
				{
					var jThis = $(this);
					jThis.closest('div > table').toggle(!targetId || jThis.attr('userid') === targetId);
				});
			};

			$.prioritize(always, function()
			{
				if(targetId) toggleReplies($j);
			});
		}
	}]
}

});