$.extend(an.plugins, {

'c99f77af-c434-4518-9d76-2170aaa21bde':
{
	desc: '初始化',
	page: { 65535: 'comp' },
	type: 1,
	queue: [{
		fn: function()
		{
			if($d.pageName() === 'view') $('select[name=page]').val($.pageNo()); // for FF3 where select box does not reset

			$.ss('a > img { border: 0; }');

			$.ss('.TransparentGrayBackground, .TransparentGrayBackground + * { z-index: 10; }');

			$('script').empty().each(function()
			{
				this.removeAttribute('src');
			});
		}
	}]
},

'11f1c5ca-9455-4f8e-baa7-054b42d9a2c4':
{
	desc: '自動轉向正確頁面',
	page: { 65534: on },
	type: 4,
	queue: [{
		priority: 1,
		fn: function()
		{
			if(location.pathname !== '/login.aspx' && document.referrer.indexOf('/login.aspx') > 0) {
				location.replace('/topics.aspx?type=BW');
			}
			else {
				var ajaxPageNo = $.bbq.getState('page');

				if(ajaxPageNo && ajaxPageNo != $.pageNo()) {
					location.replace($.uri({ querySet: { page: ajaxPageNo === 1 ? null : ajaxPageNo }, fragmentSet: { page: null } }));
				}
			}
		}
	}]
},

'a599dafa-b550-4b28-921a-019c72f481e5':
{
	desc: '除錯模式',
	page: { 65535: off },
	type: 1,
	queue: [{
		fn: function()
		{
			an.debugMode = true;

			$.run('addButton', '移除儲存資料', function()
			{
				if(confirm('確定移除儲存資料?')) {
					$.storage(null);
					location.reload();
				}
			});

			$.run('addButton', '顯示儲存資料', function()
			{
				if(!$('#an-savedsettings').length) {
					$.run('box', 'an-savedsettings', '儲存資料', null, 'max');
					$.ss('#an-savedsettings { padding: 0 2em; } #an-savedsettings code { display: block; white-space: pre; margin: 1em 0; font-family: Consolas; }');
					$('#an-savedsettings').append('<code></code>');
				}
				$('#an-savedsettings code').text($.storage().replace(/{[^{]*},?/g, function(sMatch){ return sMatch.replace(/,/g, ',\n'); }));
				$.run('gray', true, 'an-savedsettings');
			});

			$.run('addButton', '顯示功能列表', function()
			{
				if(!$('#an-functionlist').length) {
					$.run('box', 'an-functionlist', '功能列表', 600, 400);
					$.ss('#an-functionlist textarea { margin: 10px; width: 570px; height: 370px; font-family: Consolas; }');
					$('#an-functionlist').append('<textarea readonly="readonly"></textarea>');

					var sList = '';
					$.each(an.mod, function(sMod)
					{
						if(!this.fn) return;

						sList += '\r' + sMod + ':\r\r';

						$.each(this.fn, function()
						{
							sList += ' * ' + this.desc + '\r';
						});
					});

					$('#an-functionlist textarea').text(sList);
				}
				$.run('gray', true, 'an-functionlist');
			});
		}
	}]
},

'78af3c29-9bf2-47ee-80bf-a3575b711c73':
{
	desc: '自動檢查更新',
	page: { 4: on },
	type: 1,
	options: {
		alsoCheckBeta: { desc: '同時檢查Beta版本', defaultValue: false, type: 'checkbox' },
		updateInterval: { desc: '檢查更新間隔(小時)', defaultValue: 1, type: 'text' }
	},
	db: {
		lastChecked: { defaultValue: 0 }
	},
	queue: [{
		fn: function(job)
		{
			var
			interval = job.options('updateInterval'),
			lastChecked = job.db('lastChecked');

			if($.time() - lastChecked < 36e5 * (interval < 1 ? 1 : interval)) return;
			job.db('lastChecked', $.time());

			$.ajax({
				url: 'http://helianthus-annuus.googlecode.com/svn/other/an.version.js',
				dataType: 'jsonp',
				jsonpCallback: 'an-autoupdate',
				success: function(lastest)
				{
					var
					type = job.options('alsoCheckBeta') ? 'beta' : 'stable',
					current = an.version.split('.');
					lastest = lastest[type].split('.');

					for(var i=0; i<lastest.length; ++i) {
						if(current[i] !== lastest[i]) {
							if(current[i] < lastest[i] && confirm('發現新版本!\n按確定進行更新')) {
								$.each([ ['MAXTHON 2.0', 'm2f'], ['Gecko', 'xpi'], ['Chrome/4', 'crx'] ], function(j, set)
								{
									if(navigator.userAgent.indexOf(set[0]) !== -1) {
										window.open($.format('http://helianthus-annuus.googlecode.com/svn/dist/v3/{0}/annuus.{1}', type, set[1]), '_self');
										return false;
									}
								});
								window.open('http://code.google.com/p/helianthus-annuus/wiki/Changelog', '_blank');
							}
							break;
						}
					}
				}
			});
		}
	}]
},

'c217bf55-6d44-42d1-8fc2-2cd1662d604a':
{
	desc: '轉頁後再次運行功能',
	page: { 64: on },
	type: 1,
	queue: [{
		fn: function()
		{
			window.Profile_ShowGoogleAds = $('.main_table1').an;
		}
	}]
}

});