$.extend(an.plugins, {

'bc2521cd-cf65-4cc5-ac9d-4fedef3c3a97':
{
	desc: 'Ajax式列表更新',
	pages: { on: [topics] },
	type: 7,
	options:
	{
		nNumOfTopicPage: { desc: '列表顯示數量', defaultValue: 1, type: 'text' },
		bAutoRefresh_T: { desc: '預設啟用自動更新', defaultValue: false, type: 'checkbox' },
		bAddToggleAutoBtn_T: { desc: '加入切換自動更新按扭', defaultValue: false, type: 'checkbox' },
		nRefreshInterval_T: { desc: '自動更新間隔(秒)', defaultValue: 30, type: 'text' }
	},
	queue: [{
		fn: function(job)
		{
			var refreshTopics = function(nPage)
			{
				clearTimeout(tRefresh);

				if(isNaN(nPage) || nPage < 1)
				{
					nPage = 1;
					$.run('log', '正在讀取最新列表...');
				}

				$.getDoc($.search({ page: nPage }), function(jNewDoc)
				{
					var jNewTbody = jNewDoc.topicTable().children();
					var jTopicTable = $d.topicTable();

					if(nPage == 1) jTopicTable.empty();
					jTopicTable.append(jNewTbody);

					if(nPage == job.options('nNumOfTopicPage'))
					{
						jTopicTable.an();
						$.run('log', '列表更新完成');

						if(bAutoRefresh)
						{
							$.run('log2', $.format('{0}秒後再次重新整埋....', nInterval));
							setNextRefresh();
						}
					}
					else
					{
						refreshTopics(nPage + 1);
					}
				});
			};

			if(job.options('nNumOfTopicPage') > 1)
			{
				setTimeout(function(){ refreshTopics(2); }, 0);
			}

			var setNextRefresh = function()
			{
				tRefresh = setTimeout(refreshTopics, nInterval * 1000);
			};

			var tRefresh;
			var bAutoRefresh = job.options('bAutoRefresh_T');
			var nInterval = job.options('nRefreshInterval_T');
			if(nInterval < 30) nInterval = 30;

			if(bAutoRefresh) setNextRefresh();
			if(job.options('bAddToggleAutoBtn_T')) $.run('addButton', '切換自動更新', function()
			{
				if(bAutoRefresh)
				{
					clearTimeout(tRefresh);
					$.run('log', '已停用自動更新');
				}
				else
				{
					setNextRefresh();
					$.run('log', '已啟用自動更新');
				}
				bAutoRefresh = !bAutoRefresh;
			});

			$.run('addButton', '更新列表', refreshTopics);
		}
	}]
}

});