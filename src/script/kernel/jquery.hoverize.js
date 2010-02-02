(function($)
{
	var jHoverObjects, objectSets = [], recordOffset = function()
	{
		var data = $(this).data('hoverize');
		data.fixScroll_difference = data.jTarget[data.fixScroll]() - $d.scrollTop();
	};

	$.fn.hoverize = function(selector, option)
	{
		if(!jHoverObjects) {
			$.ss('\
			#an-hoverobjects > * { display: none; position: absolute; } \
			#an-hoverobjects > img, #an-hoverobjects > span { cursor: pointer; } \
			');

			jHoverObjects = $('<div id="an-hoverobjects"></div>').appendTo('#an').bind({
				click: function(event)
				{
					event.stopPropagation();

					var jObject = $(event.target).closest('#an-hoverobjects > *'),
					data = jObject.data('hoverize');

					if(!data) return;

					var jTarget = data.jTarget;

					if(data.fixScroll) $d.scrollTop(jTarget[data.fixScroll]() - data.fixScroll_difference);

					if(!data.autoToggle) return;

					data.jTarget = null;
					jObject.hide();
					jTarget.mouseover();
					jObject.mouseover();
				},
				'mouseover mouseout entertarget leavetarget': function(event)
				{
					event.stopPropagation();
				}
			});

			$d.mouseover(function(event)
			{
				var jEnterTree = $(event.target).parentsUntil('#aspnetForm').andSelf();

				$.each(objectSets, function(i, objectSet)
				{
					var jNewTarget = jEnterTree.filter(objectSet.selector).eq(-1),
					jObject = objectSet.jObject,
					data = jObject.data('hoverize');

					if(data.filter) jNewTarget = jNewTarget.filter(data.filter);

					if(data.jTarget) {
						if(jNewTarget[0] && jNewTarget[0] === data.jTarget[0]) {
							return;
						}
						else {
							jObject.trigger('leavetarget');
							data.jTarget = null;

							if(data.autoToggle) jObject.hide();
						}
					}

					if(jNewTarget.length) {
						data.jTarget = jNewTarget;
						jObject.trigger('entertarget');

						if(data.autoPosition) jObject.css(jNewTarget.offset());
						if(data.autoToggle) jObject.show();
					}
				});
			});
		}

		var jObject = this;

		if(selector === null) {
			$.each(objectSets, function(i)
			{
				if(this.jObject[0] === jObject[0]) {
					objectSets.splice(i, 1);
					return false;
				}
			});
		}
		else {
			objectSets.push({ selector: selector, jObject: jObject });
			this.data('hoverize', $.extend({ fixScroll: false, fixScroll_autoRecord: true, autoToggle: true, autoPosition: true, filter: null }, option)).appendTo(jHoverObjects);

			if(this.data('hoverize').fixScroll && this.data('hoverize').fixScroll_autoRecord) this.click(recordOffset);
		}

		return this;
	};
})(jQuery);

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