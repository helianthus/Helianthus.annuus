bolanderi.addModules(function(){ return {

'0f7cdd14-1e7a-4481-81d4-24709102f887':
{
	title: 'Hoverize API',
	pages: { comp: [all] },
	api: [
		{
			type: 'generic',
			page: view,
			js: function()
			{
				var jHoverObjects, objectSets = [], recordOffset = function()
				{
					var data = $(this).data('hoverize');
					data.fixScroll_difference = data.jTarget[data.fixScroll]() - $(document).scrollTop();
				};

				$.fn.hoverize = function(selector, option)
				{
					if(!jHoverObjects) {
						$.rules('\
						#an-hoverobjects > * { display: none; position: absolute; z-index: 1; } \
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

								if(data.fixScroll) $(document).scrollTop(jTarget[data.fixScroll]() - data.fixScroll_difference);

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

						$(document).mouseover(function(event)
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
			}
		}
	]
}

}; });
