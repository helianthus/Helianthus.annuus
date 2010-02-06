$.extend(an.plugins, {

'231825ad-aada-4f5f-8adc-5c2762c1b0e5':
{
	desc: '顯示資料: 樓主名稱',
	pages: { on: [view] },
	type: 5,
	queue: [{
		fn: function(job)
		{
			$.openerInfo(function(info)
			{
				$.run('addInfo', $.format('樓主: <a target="_blank" href="/ProfilePage.aspx?userid={0}">{1}</a>', info.userid, info.username));
			});
		}
	}]
},

'9e181e79-153b-44d5-a482-5ccc6496a172':
{
	desc: '顯示資料: 累計在線時間',
	pages: { off: [normal] },
	type: 5,
	queue: [{
		priority: 2,
		fn: function(job)
		{
			var nLastOnTime = job.db('nLastOnTime');
			var nCumulatedTime = job.db('nCumulatedTime') || 0;

			if(nLastOnTime)
			{
				var nDifference = $.time() - nLastOnTime;
				nCumulatedTime += (nDifference >= 120000) ? 120000 : nDifference;
			}

			var sCumulated;
			if(nCumulatedTime > 86400000)
			{
				sCumulated = (nCumulatedTime / 86400000).toFixed(2) + ' days';
			}
			else if(nCumulatedTime > 3600000)
			{
				sCumulated = (nCumulatedTime / 3600000).toFixed(2) + ' hours';
			}
			else
			{
				sCumulated = (nCumulatedTime / 60000).toFixed(2) + ' minutes';
			}

			$.run('addInfo', '在線時間: ' + sCumulated);

			job.db('nLastOnTime', $.time());
			job.db('nCumulatedTime', nCumulatedTime);
		}
	}]
},

'f47e77c8-6f1a-43b2-8493-f43de222b3b4':
{
	desc: '加入伺服器狀態顯示按扭',
	pages: { on: [normal] },
	type: 5,
	queue: [{
		priority: 2,
		fn: function(job)
		{
			$.run('addButton', '伺服器狀態', $.serverTable);
		}
	}]
},

'7de28ca9-9c44-4949-ad4a-31f38a984715':
{
	desc: '加入一鍵留名按扭',
	pages: { off: [view] },
	type: 5,
	options: { sLeaveNameMsg: { desc: '回覆內容', defaultValue: '留名', type: 'text' } },
	queue: [{
		fn: function(job)
		{
			if(!$.isLoggedIn()) return;

			$.run('addButton', '一鍵留名', function()
			{
				$('#ctl00_ContentPlaceHolder1_messagetext').val(job.options('sLeaveNameMsg'));
				$('#aspnetForm').submit();
			});
		}
	}]
},

'69260bc4-4f43-4dda-ba0f-87ba804a866c':
{
	desc: '加入同步登入所有server的按扭',
	pages: { off: [normal] },
	type: 5,
	queue: [{
		priority: 2,
		fn: function(job)
		{
			$.run('addButton', '登入所有server', function()
			{
				var sEmail, sPass;
				if(!(sEmail = prompt('請輸入電郵地址', ''))) return;
				if(!(sPass = prompt('請輸入密碼', ''))) return;

				var nServer = 8;

				var aLeft = [];
				for(var i=1; i<=nServer; i++)	aLeft.push(i);

				var complete = function(bForce)
				{
					if(aLeft.length === 0 || bForce)
					{
						alert($.format('登入完成!{0}\n\n點擊確定重新整理頁面.', aLeft.length ? $.format('\n\n伺服器{0}登入失敗!', aLeft.join(',')) : ''));
						location.reload();
					}
				};

				var login = function(nForum)
				{
					if(!this.contentWindow.document.getElementById('aspnetForm')) // error page
					{
						$.run('log', $.format('伺服器{0}登入失敗!', nForum));
						complete();
						return;
					}

					var _$ = this.contentWindow.jQuery;

					_$('#ctl00_ContentPlaceHolder1_txt_email').val(sEmail);
					_$('#ctl00_ContentPlaceHolder1_txt_pass').val(sPass);

					_$.post('login.aspx', _$('#aspnetForm').serialize() + '&ctl00%24ContentPlaceHolder1%24linkb_login=', function()
					{
						$.each(aLeft, function(i, n)
						{
							if(n == nForum)
							{
								aLeft.splice(i, 1);
								return false;
							}
						});

						$.run('log', $.format('伺服器{0}登入成功!', nForum));
						complete();
					});
				};

				$.run('log', '登入各伺服器中, 請稍候...');

				$.each(aLeft, function(i, nForum)
				{
					$('<iframe style="display: none;"></iframe>')
					.appendTo('#an')
					.attr('src', $.format('http://forum{0}.hkgolden.com/login.aspx', nForum))
					.load(function()
					{
						login.call(this, nForum);
					})
					.error(function()
					{
						$.run('log', $.format('伺服器{0}登入失敗!', nForum));
						complete();
					});
				});

				setTimeout(function(){ complete(true); }, 10000);
			});
		}
	}]
},

'13c276a5-f84e-4f53-9ada-45545ccc6b2e':
{
	desc: '加入同步登出所有server的按扭',
	pages: { off: [normal] },
	type: 5,
	queue: [{
		priority: 2,
		fn: function(job)
		{
			$.run('addButton', '登出所有server', function()
			{
				if(!confirm('確定登出所有server?')) return;

				var nServer = 8;

				var aLeft = [];
				for(var i=1; i<=nServer; i++)	aLeft.push(i);

				var complete = function(bForce)
				{
					if(aLeft.length === 0 || bForce)
					{
						alert($.format('登出完成!{0}\n\n點擊確定重新整理頁面.', aLeft.length ? $.format('\n\n伺服器{0}登出失敗!', aLeft.join(',')) : ''));
						location.reload();
					}
				};

				$.run('log', '登出各伺服器中, 請稍候...');

				$.each(aLeft, function(i, nForum)
				{
					$($.format('<img src="http://forum{0}.hkgolden.com/logout.aspx" />', nForum))
					.appendTo('#an')
					.error(function()
					{
						$.each(aLeft, function(i, n)
						{
							if(n == nForum)
							{
								aLeft.splice(i, 1);
								return false;
							}
						});

						$.run('log', $.format('伺服器{0}登出完成!', nForum));
						complete();
					});
				});

				setTimeout(function(){ complete(true); }, 10000);
			});
		}
	}]
},

'aad1f3ac-e70c-4878-a1ef-678539ca7ee4':
{
	desc: '加入前往吹水台的快速連結',
	pages: { on: [normal] },
	type: 5,
	queue: [{
		priority: 2,
		fn: function(job)
		{
			$.run('addLink', '吹水台', '/topics.aspx?type=BW', 1);
		}
	}]
},

'd0d76204-4033-4bd6-a9a8-3afbb807495f':
{
	desc: '加入前往最頂/底的按扭',
	pages: { on: [view] },
	type: 5,
	queue: [{
		priority: 5,
		fn: function(job)
		{
			$.run('addLink', '最頂', function(){ document.body.scrollIntoView(); }, 0);
			$.run('addLink', '最底', function(){ document.body.scrollIntoView(false); }, 2);
		}
	}]
},

'b78810a2-9022-43fb-9a9b-f776100dc1df':
{
	desc: '加入樓層編號',
	pages: { on: [view] },
	type: 5,
	queue: [{
		type: always,
		fn: function(job)
		{
			var nCurPageNo = $j.ajaxPageNo();
			var nFloor = ((nCurPageNo == 1) ? 0 : 25 * (nCurPageNo - 1) + 1) + $j.pageRoot().find('.an-content-floor').length;

			$j.replies().find('span:last').append(function(i){ return $.format(' <span class="an-content-floor an-content-box">#{0}</span>', nFloor + i); });
		}
	}]
}

});