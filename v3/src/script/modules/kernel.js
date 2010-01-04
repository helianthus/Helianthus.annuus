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

		if($d.pageName() == 'view') $('select[name=page]').val(AN.util.getPageNo(location.href)); // for FF3 where select box does not reset
		
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
		if(document.referrer.indexOf('/login.aspx') > 0) location.replace('/topics.aspx?type=BW');

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
		.an-forum input[type="text"], .an-forum select { background-color: %(sMainBgColor)s; border: 1px solid %(sMainBorderColor)s; color: graytext; } \
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
		if($.time() - AN.util.data('nLastChecked') < 3600000 * nInterval) return;

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
					if(aCurrent[i] < aLastest[i] && confirm('發現新版本!\n按確定進行更新'))
					{
						var sPrefix = 'http://helianthus-annuus.googlecode.com/svn/dist/v3/' + sType;
						
						if(navigator.userAgent.indexOf('MAXTHON 2.0') != -1) window.open(sPrefix + 'annuus.m2f', '_self');
						//else if($.browser.mozilla && typeof unsafeWindow != 'undefined') window.open(sPrefix + 'annuus.user.js', '_self');
						//else if(navigator.userAgent.indexOf('Chrome') == -1) window.open(sPrefix + 'annuus.crx', '_self');
						
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
	page: { 65534: true },
	type: 3,
	infinite: function()
	{
		AN.util.stackStyle(' \
		body { word-wrap: break-word; } \
		.ListPMText table, .repliers table { overflow-x: hidden; table-layout: fixed; } \
		');
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
}

}};