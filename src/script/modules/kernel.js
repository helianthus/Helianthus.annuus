AN.mod['Kernel'] = { ver: 'N/A', author: '向日', fn: {

'Kernel_Initializer':
{
	desc: '初始化',
	page: { 65535: 'comp' },
	type: 1,
	once: function(jDoc)
	{
		if(!$('head').length) $('html').prepend(document.createElement('head')); // chrome

		$.ajaxSetup(
		{
			cache: false,
			contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
		});

		var AN_VER = '3.5b';

		if(AN.util.data('AN-version') != AN_VER)
		{
			if(AN.util.data('AN-version'))
			{
				AN.util.storage(null);
				AN.util.data('AN-version', AN_VER);
				alert('由於內核改動, 所有設定已被重設.\n不便之處, 敬請原諒.');
				return location.reload();
			}

			AN.util.data('AN-version', AN_VER);
		}

		if($d.pageName() == 'view') $('select[name=page]').val(AN.util.getPageNo(location.search)); // for FF3 where select box does not reset

		$('script').empty();
	}
},

'11f1c5ca-9455-4f8e-baa7-054b42d9a2c4':
{
	desc: '自動轉向正確頁面',
	page: { 65534: true },
	type: 4,
	once: function()
	{
		//if(location.pathname !== '/login.aspx' && document.referrer.indexOf('/login.aspx') > 0) location.replace('/topics.aspx?type=BW');

		if(location.hash.indexOf('#page=') != -1 && AN.util.getPageNo(location.search) != AN.util.getPageNo(location.hash))
			return location.replace( AN.util.getURL({ page: location.hash.replace(/#page=/, '') }).replace(/&highlight_id=0\b/, '') );
	}
},

'a599dafa-b550-4b28-921a-019c72f481e5':
{
	desc: '除錯模式 [除錯按扭、更準確評測結果等]',
	page: { 65535: false },
	type: 1,
	once: function(jDoc)
	{
		AN.box.debugMode = true;

		AN.util.addStyle('');
		AN.util.getOptions();
		AN.util.getOptions.oOptions['bAutoShowLog'] = true;
		AN.util.getOptions.oOptions['bShowDetailLog'] = true;

		if($d.pageCode() & 92)
		{
			jDoc.topics();
		}
		else if($d.pageName() == 'view')
		{
			jDoc.replies();
		}

		jDoc.defer(1, '加入啟動Firebug Lite的按扭', function()
		{
			AN.shared('addButton', '啟動Firebug Lite', function()
			{
				$.getScript('http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js', function()
				{
					window.firebug.init();
				});
			});
		});
	}
},

'12c98ebc-873c-4636-a11a-2c4c6ce7d4c2':
{
	desc: '設定內核樣式',
	page: { 65535: 'comp' },
	type: 2,
	options:
	{
		sUIFontColor: { desc: 'UI主顏色', defaultValue: '#808080', type: 'text' },
		sUIHoverColor: { desc: 'UI連結懸浮顏色', defaultValue: '#9ACD32', type: 'text' },
		sMainFontColor: { desc: '論壇主要字體顏色', defaultValue: '#000000', type: 'text' },
		sMainBorderColor: { desc: '論壇主要邊框顏色', defaultValue: '#000000', type: 'text' },
		sSecBorderColor: { desc: '論壇次要邊框顏色', defaultValue: '#CCCCCC', type: 'text' },
		sMainBgColor: { desc: '論壇主要背景顏色', defaultValue: '#FFFFFF', type: 'text' },
		sSecBgColor: { desc: '論壇次要背景顏色', defaultValue: '#F8F8F8', type: 'text' },
		sMainHeaderFontColor: { desc: '論壇標題字體顏色', defaultValue: '#FFFFFF', type: 'text' },
		sMainHeaderBgColor: { desc: '論壇標題背景顏色', defaultValue: '#336699', type: 'text' }
	},
	once: function()
	{
		AN.util.stackStyle($.sprintf(' \
		#an, #an legend { color: %(sMainFontColor)s; } \
		\
		.an-forum, .an-forum textarea { background-color: %(sSecBgColor)s; } \
		.an-forum input[type="text"], .an-forum select { background-color: %(sMainBgColor)s; border: 1px solid %(sMainBorderColor)s; } \
		.an-forum input[type="text"]:disabled, .an-forum select:disabled { color: graytext; } \
		.an-forum, .an-forum h4, .an-forum div, .an-forum td, .an-forum dl, .an-forum dt, .an-forum dd, .an-forum ul, .an-forum li, .an-forum a, .an-forum fieldset, .an-forum hr { border: 0 solid %(sMainBorderColor)s; } \
		.an-forum * { color: %(sMainFontColor)s; } \
		.an-forum a { text-decoration: none; } \
		.an-forum a:hover { text-decoration: underline; } \
		.an-forum table { width: 100%; border-collapse: collapse; } \
		.an-forum td { line-height: 1.5em; padding: 0 0.2em; border-width: 1px; } \
		.an-forum-header[class], .an-forum thead td { color: %(sMainHeaderFontColor)s; background-color: %(sMainHeaderBgColor)s; } \
		.an-forum-header[class] { border-bottom-width: 1px; } \
		\
		.an-content-note, .an-content-line, .an-content-box { color: %(sUIFontColor)s; } \
		.an-content-note { margin-right: 2px; cursor: default; } \
		.an-content-line { font-size: 0.625em; font-style: italic; } \
		.an-content-box { display: inline-block; border: 1px solid; padding: 1px 2px; } \
		a.an-content-line, a.an-content-box { text-decoration: none !important; } \
		a.an-content-line:hover, a.an-content-box:hover { color: %(sUIHoverColor)s; } \
		',
		AN.util.getOptions()
		));
	}
},

'78af3c29-9bf2-47ee-80bf-a3575b711c73':
{
	desc: '自動檢查更新',
	defer: 5,
	page: { 4: true },
	type: 1,
	options:
	{
		bAlsoCheckBeta: { desc: '同時檢查Beta版本', defaultValue: false, type: 'checkbox' },
		nCheckUpdateInterval: { desc: '檢查更新間隔(小時)', defaultValue: 1, type: 'text' }
	},
	once: function()
	{
		var nInterval = AN.util.getOptions('nCheckUpdateInterval');
		if(isNaN(nInterval) || nInterval < 1) nInterval = 1;
		var nLastChecked = AN.util.data('nLastChecked') || 0;
		if($.time() - nLastChecked < 3600000 * nInterval) return;

		AN.util.getData('main', function(oMain)
		{
 			AN.util.data('nLastChecked', $.time());

			var sType = AN.util.getOptions('bAlsoCheckBeta') ? 'beta' : 'stable';

			if(oMain.ver[sType]['annuus'] === undefined) return;

			var aLastest = oMain.ver[sType]['annuus'].split('.');
			var aCurrent = AN.version.split('.');

			for(var i=0; i<aLastest.length; i++)
			{
				if(aCurrent[i] != aLastest[i])
				{
					if(+aCurrent[i] < +aLastest[i] && confirm('Helianthus.annuus:\n發現新版本!\n按確定進行更新'))
					{
						var sPrefix = 'http://helianthus-annuus.googlecode.com/svn/dist/v3/' + sType + '/';

						if(navigator.userAgent.indexOf('MAXTHON 2.0') !== -1) window.open(sPrefix + 'annuus.m2f', '_self');
						else if ($.browser.mozilla) window.open(sPrefix + 'annuus.xpi', '_self');
						else if(navigator.userAgent.indexOf('Chrome/') !== -1) window.open(sPrefix + 'annuus.crx', '_self');

						window.open('http://code.google.com/p/helianthus-annuus/wiki/Changelog', '_blank');
					}

					break;
				}
			}
		});
	}
},

'c217bf55-6d44-42d1-8fc2-2cd1662d604a':
{
	desc: '轉頁後再次運行功能',
	page: { 64: true },
	type: 1,
	once: function()
	{
		window.Profile_ShowGoogleAds = AN.modFn.execMods;
	}
},

'722b69f8-b80d-4b0e-b608-87946e00cfdc':
{
	desc: '強制鎖定闊度',
	page: { 65534: 'comp' },
	type: 3,
	once: function()
	{
		var css = 'body { word-wrap: break-word; } .DivResizableBoxDetails { word-wrap: normal; }';

		if($(document).pageName() === 'view') {
			css += '\
			.repliers, .repliers_right { table-layout: fixed; } \
			.repliers_right > tbody > tr:first-child > td { overflow-x: hidden; } \
			';
		}

		AN.util.stackStyle(css);
	},
	infinite: function(jDoc)
	{
		if(jDoc.pageNo() === 1) {
			jDoc.replies().eq(0).find('td[colspan="100%"]').attr('colspan', 2);
		}
	}
},

'1b804b67-40ab-4750-8759-e63346d289ef':
{
	desc: '設定論壇浮動物件至最上層',
	page: { 65534: true },
	type: 4,
	infinite: function()
	{
		AN.util.stackStyle('.TransparentGrayBackground, .TransparentGrayBackground + * { z-index: 10; }');
	}
},

'437b66e6-abe9-4b5a-ac0e-d132d0578521':
{
	desc: '特殊設定: 備份設定',
	page: { 65535: 'comp' },
	type: 1,
	once: function()
	{
		$(document).one('an-settings-special', function(event)
		{
			var configTmpl = { name: 'an-config', version: 2.1 };
			
			$('\
			<div> \
				<h4><span>備份設定</span><hr /></h4> \
				<div><button id="an-settings-special-export">備份所有設定</button> <button id="an-settings-special-import-text">還原所有設定(手動輸入)</button> <button id="an-settings-special-import-file">還原所有設定(從檔案)</button></div> \
			</div> \
			')
			.appendTo(event.target)
			.on('click', '#an-settings-special-export', function()
			{
				var config = $.extend({}, configTmpl);
				
				$.each(['an_data', 'an_switches', 'an_options'], function(i, name)
				{
					config[name] = AN.util.storage(name);
				});
				
				$('#an-settings-special-config').val(window.btoa(unescape(encodeURIComponent(JSON.stringify(config)))) || '').select();
				alert('滙出成功! 請複製設定資料');
			})
			.on('click', '#an-settings-special-import-text, #an-settings-special-import-file', function(event)
			{
				if(event.target.id === 'an-settings-special-import-text') {
					var config = prompt('請輸入設定資料', '');
					
					if(!config) {
						return;
					}
					
					importConfig(config);
				}
				else {
					$('<input type="file" />').one('change', function(event)
					{
						if(this.files && window.FileReader) {
							var reader = new FileReader();
							
							reader.onload = function()
							{
								importConfig(reader.result);
							};
							
							reader.onerror = function(config)
							{
								alert('讀取設定資料時發生錯誤!');
							};
							
							reader.readAsText(this.files[0]);
						}
						else {
							alert('你的瀏覽器不支持此功能!');
						}
					}).click();
				}
				
				function importConfig(config)
				{
					try {
						config = JSON.parse(decodeURIComponent(escape(window.atob(config))));
					}
					catch(e) {
						return alert('設定資料剖析錯誤!');
					}
					
					if(config.name !== configTmpl.name) {
						return alert('設定資料格式錯誤!');
					}
					
					if(config.version !== configTmpl.version) {
						return alert('不相容的設定資料版本: ' + config.version);
					}
					
					$.each(['an_data', 'an_switches', 'an_options'], function(i, name)
					{
						if(name in config) {
							AN.util.storage(name, config[name]);
						}
					});
					
					AN.shared.fillOptions(true);
					alert('滙入成功!');
				}
			});
		});
	}
},

'297a1341-587f-4076-bbfc-342c0b8140b1':
{
	desc: '特殊設定: 同步設定',
	page: { 65535: 'comp' },
	type: 1,
	once: function()
	{
		var working = false;
		
		function iframeSync(type, data)
		{
			if(working) {
				alert('同步進行中, 請等待工作完成');
				return;
			}
			
			working = true;
			
			var msg = $('#an-settings-special-sync-msg').text('同步中, 請稍候...');
			
			data = JSON.stringify({ type: type, value: data });
			var curForum = AN.util.getForumNo();
			var iframes = $();
			var failed = [];
			
			var onerror = function()
			{
				failed.push($(this).data('forum'));
				done(this);
			};
			
			var done = function(iframe)
			{
				iframes = iframes.not(iframe);
				$(iframe).remove();
				
				if(iframes.length === 0) {
					msg.text('');
					alert('同步完成!' + (failed.length ? '\n\n以下伺服器同步失敗:\n' + failed.sort() : ''));
					working = false;
				}
			};
			
			$(window).on('message', function(event)
			{
				try {
					var type = JSON.parse(event.originalEvent.data).type;
				}
				catch(e) {}
				
				if(type === 'an-sync-ready') {
					event.originalEvent.source.postMessage(data, '*');
				}
				else if(type === 'an-sync-complete') {
					done(event.originalEvent.source.frameElement);
				}
			});
			
			for(var i=1; i<=11; i++) {
				if(i !== curForum) {
					iframes = iframes.add($($.sprintf('<iframe src="http://forum%s.hkgolden.com/error.html?an_sync" data-forum="%s" style="display:none"></iframe>', i, i)));
				}
			}
					
			setTimeout(function()
			{
				$.each(iframes, function()
				{
					onerror.call(this);
				});
			}, 10000);
			
			iframes.on({ error: onerror }).appendTo('#an');
		}
		
		$(document).one('an-settings-special', function(event)
		{
			$('\
			<div> \
				<h4><span>同步設定</span><hr /></h4> \
				<div><button id="an-settings-special-sync-settings">同步所有設定至其他伺服器</button> <button id="an-settings-special-sync-cookies">同步登入資料至其他伺服器</button> <span id="an-settings-special-sync-msg"></span></div> \
			</div> \
			')
			.appendTo(event.target)
			.on('click', '#an-settings-special-sync-settings', function()
			{
				var data = {};
				
				$.each(['an_data', 'an_switches', 'an_options'], function(i, name)
				{
					data[name] = AN.util.storage(name);
				});
				
				iframeSync('an-sync-settings', JSON.stringify(data));
			})
			.on('click', '#an-settings-special-sync-cookies', function()
			{
				var data = {};
				
				$.each(['remember_pass', 'username', 'ep', 'companymode', 'sensermode', 'filtermode', 'fontsize'], function(i, name)
				{
					data[name] = AN.util.cookie(name);
				});
				
				iframeSync('an-sync-cookies', JSON.stringify(data));
			});
		});
		
		if(top !== self && location.search.indexOf('an_sync') !== -1) {
			$(window).on('message', function(event)
			{
				try {
					var data = JSON.parse(event.originalEvent.data);
				}
				catch(e) {
					return;
				}
				
				if(data.type === 'an-sync-settings') {
					data = JSON.parse(data.value);
				
					$.each(['an_data', 'an_switches', 'an_options'], function(i, name)
					{
						if(name in data) {
							AN.util.storage(name, data[name]);
						}
					});
					
					event.originalEvent.source.postMessage(JSON.stringify({ type: 'an-sync-complete' }), '*');
				}
				else if(data.type === 'an-sync-cookies') {
					data = JSON.parse(data.value);
				
					$.each(['remember_pass', 'username', 'ep', 'companymode', 'sensermode', 'filtermode', 'fontsize'], function(i, name)
					{
						if(name in data) {
							AN.util.cookie(name, data[name]);
						}
					});
					
					event.originalEvent.source.postMessage(JSON.stringify({ type: 'an-sync-complete' }), '*');
				}
			});
		
			window.top.postMessage(JSON.stringify({ type: 'an-sync-ready' }), '*');
		}
	}
}

}};