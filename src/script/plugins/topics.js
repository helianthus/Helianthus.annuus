$.extend(an.plugins, {

'86d24fc8-476a-4de3-95e1-5e0eb02b3353':
{
	desc: '轉換表情碼為圖片',
	page: { 92: on },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var codes = [];
			job.plugin.smileys = {};

			$.each(an.smileys, function(i, typeSet)
			{
				$.each(typeSet.table, function(j, row)
				{
					$.each(row, function(k, cell)
					{
						$.each(cell, function(l, smileySet)
						{
							job.plugin.smileys[smileySet[0]] = typeSet.path + smileySet[1];
							codes.push(smileySet[0].replace(/[[\]()?]/g, '\\$&'));
						});
					});
				});
			});

			job.plugin.rCodes = new RegExp(codes.join('|'), "g");
		}
	},
	{
		type: always,
		fn: function(job)
		{
			$j.topics().each(function()
			{
				var
				jTitle = $(this).find('a:first'),
				oldTitle = jTitle.text(),
				newTitle = oldTitle.replace(job.plugin.rCodes, function($0){ return '<img src="'+job.plugin.smileys[$0]+'.gif" alt="'+$0+'" />'; });

				if(oldTitle !== newTitle) jTitle.html(newTitle);
			});
		}
	}]
},

'b69c5067-2726-43f8-b3de-dfb907355b71':
{
	desc: '標題過濾功能',
	page: { 4: on },
	type: 6,
	options:
	{
		bFilterListButton: { desc: '加入標題過濾列表按扭', defaultValue: true, type: 'checkbox' },
		bAddFilterButton: { desc: '加入新增過濾器按扭', defauleValue: false, type: 'checkbox' }
	},
	db: {
		filters: { defaultValue: [], access: 'protected' }
	},
	queue: [{
		fn: function(job)
		{
			var aFilter = job.db('filters'),
			jHiddenImg,
			jButton = $('<img />', { src: an.resources['cross-shield'], css: { 'margin-left': '-1.5px' } }).hoverize('#HotTopics tr:not(:first-child)', { autoPosition: false })
			.bind({
				entertarget: function()
				{
					jHiddenImg = jButton.data('hoverize').jTarget.find('img:first').css('visibility', 'hidden');
					jButton.css(jHiddenImg.offset());
				},
				leavetarget: function()
				{
					jHiddenImg.css('visibility', 'visible');
				},
				click: function()
				{
					addFilter(jButton.data('hoverize').jTarget.find('a:first').html().replace(/<img[^>]+?alt="?([^" ]+)[^>]*>/ig, '$1'));
				}
			});

			var addFilter = function(sTopicName)
			{
				var sFilter = prompt('請輸入過濾器', sTopicName || '');
				if(!sFilter) return;

				aFilter.push(sFilter);
				job.db('filters', aFilter);
				filterTopics();
			};

			var filterTopics = this.filterTopics = function(jScope)
			{
				if(!aFilter.length) return;

				var nCount = 0;
				(jScope || $d).topics().each(function()
				{
					var jThis = $(this);
					var sTitle = jThis.find('a:first').html().replace(/<img[^>]+?alt="?([^" ]+)[^>]*>/ig, '$1');
					$.each(aFilter, function(i, sFilter)
					{
						if(sTitle.indexOf(sFilter) !== -1) {
							nCount++;
							jThis.hide();
							return false;
						}
					});
				});

				if(nCount) $.run('log', $.format('{0}個標題已被過濾', nCount));
			};

			if(job.options('bAddFilterButton')) $.run('addButton', '新增過濾器', addFilter);

			if(job.options('bFilterListButton')) $.run('addButton', '標題過濾列表', function() {
				if(!$('#an-filterlist').length) {
					$.ss('\
					#an-filterlist > ul { margin: 5px; } \
					#an-filterlist > ul > li { padding: 2px 0; } \
					#an-filterlist > ul > li > span:first-child { margin-right: 5px; border: 1px solid black; padding: 0 5px; background-color: {0.sMainHeaderBgColor}; color: {0.sMainHeaderFontColor}; cursor: pointer; } \
					',
					job.options()
					);

					$.box('an-filterlist', '標題過濾列表', 500);

					$('#an-filterlist').click(function(event)
					{
						var jTarget = $(event.target);
						if(!jTarget.is('span:first-child')) return;

						var sFilter = jTarget.next().html();

						var nIndex = $.inArray(sFilter, aFilter);
						if(nIndex != -1) aFilter.splice(nIndex, 1);

						job.db('filters', aFilter);
						jTarget.parent().remove();
					});
				}

				var sHTML = '';
				if(aFilter.length) {
					$.each(aFilter, function(i, sFilter)
					{
						sHTML += $.format('<li><span>X</span><span>{0}</span></li>', sFilter);
					});
				}
				else {
					sHTML += '<li>沒有任何過濾器</li>';
				}

				$('#an-filterlist').html('<ul>' + sHTML + '</ul>');

				$.gray(true, 'an-filterlist');
			});

			$.prioritize(always, function()
			{
				filterTopics($j);
			});
		}
	}]
}

});