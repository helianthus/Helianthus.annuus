$.extend(an.plugins, {

'11f1c5ca-9455-4f8e-baa7-054b42d9a2c4':
{
	desc: '自動轉向正確頁面',
	pages: { on: [normal] },
	type: 4,
	queue: [{
		priority: 1,
		fn: function()
		{
			if(location.pathname !== '/login.aspx' && document.referrer.indexOf('/login.aspx') > 0) {
				location.replace('/topics.aspx?type=BW');
			}
			else {
				var ajaxPageNo = $.state('page');

				if(ajaxPageNo && ajaxPageNo != $.pageNo()) {
					location.replace($.uri({ querySet: { page: ajaxPageNo === 1 ? null : ajaxPageNo }, fragmentSet: { page: null } }));
				}
			}
		}
	}]
},

'c99f77af-c434-4518-9d76-2170aaa21bde':
{
	desc: '初始化',
	pages: { comp: [all] },
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

'a599dafa-b550-4b28-921a-019c72f481e5':
{
	desc: '除錯模式',
	pages: { off: [all] },
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
	pages: { disabled: [topics] },
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
	pages: { on: [profilepage] },
	type: 1,
	queue: [{
		fn: function()
		{
			window.Profile_ShowGoogleAds = $('.main_table1').an;
		}
	}]
},

'3f693a9e-e79d-4d14-b639-a57bee36079a':
{
	desc: '自動顯示伺服器狀態檢查視窗',
	pages: { on: [error] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.run('serverTable');
		}
	}]
},

'4cdce143-74a5-4bdb-abca-0351638816fa':
{
	desc: '發表新帖子的主旨過長時進行提示',
	pages: { on: [post] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			if(location.search.indexOf('mt=N') != -1)
			{
				$('#aspnetForm').submit(function()
				{
					var sTitle = $('#ctl00_ContentPlaceHolder1_messagesubject').val();
					var n = 0;
					for(var i=0; i<sTitle.length; i++)
					{
						n += sTitle.charCodeAt(i) > 255 ? 2 : 1;
					}
					if(n > 50 && !confirm('主旨過長!(位元組 > 50)\n將導致帖子發表失敗或主旨被裁剪!\n\n確定要進行發表?'))
					{
						return false;
					}
				});
			}
		}
	}]
}

});