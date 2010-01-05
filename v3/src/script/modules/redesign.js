AN.mod['Component Redesigner'] = { ver: 'N/A', author: '向日', fn: {

'8be1ac06-030a-42d4-a8f4-f2b7f4881300':
{
	desc: '改變引用風格',
	page: { 32: true },
	type: 8,
	options: {
		quoteStyle: { desc: '引用風格', type: 'select', choices: ['預設', '復古', '現代'], defaultValue: '預設' },
		quoteMaskLevel: { desc: '引用屏蔽層級', type: 'text', defaultValue: 2 }
	},
	once: function()
	{
		AN.util.stackStyle('blockquote + br, blockquote > div > br:first-child { display: none; }');
		
		var styleNo = this.styleNo = $.inArray(AN.util.getOptions('quoteStyle'), this.options.quoteStyle.choices);
		
		switch(styleNo) {
			case 0:
				AN.util.stackStyle('\
				blockquote { margin: 0; padding: 0 0 1em 40px; } \
				.an-hiddenquote { padding: 0; } \
				.an-hiddenquote:before { content: url("'+ $r['balloon--plus'] +'"); } \
				.an-hiddenquote > div { display: none; } \
				');
				
				var jCurTarget = $();
				var jButton = $('<img style="display: none; position: absolute; cursor: pointer;" />')
					.appendTo('#an')
					.click(function(event)
					{
						if(event.button !== 0) return;
						
						event.stopPropagation();
						jCurTarget.toggleClass('an-hiddenquote');
						jButton.hide();
					});
				
				var placeHolder = $('#ctl00_ContentPlaceHolder1_view_form')[0];
				$d.mouseover(function(event)
				{
					if(event.target === jButton[0]) {
						if(!jCurTarget.is('.an-hiddenquote')) jCurTarget.css('outline', '1px dashed gray');
						return;
					}
					
					if(jCurTarget.is('blockquote')) jCurTarget.css('outline', '0');
					
					jCurTarget = $(event.target).closest('blockquote', placeHolder);
					if(jCurTarget.length) {
						jButton.attr('src', $r[jCurTarget.hasClass('an-hiddenquote') ? 'balloon--plus' : 'balloon--minus']).css(jCurTarget.offset()).show();
					}
					else {
						jButton.hide();
					}
				});
			break;
			case 1:
				AN.util.stackStyle('\
				blockquote:before { content: "+"; position: relative; margin-left: -3px; color: #999; } \
				td > blockquote { margin-left: 3px; } \
				blockquote { margin: 0; padding: 0 0 1em 0; } \
				blockquote > div { border-left: 2px solid #999; padding-left: 5px; } \
				.an-hiddenquote { display: none; } \
				');
			break;
			case 2:
				AN.util.stackStyle($.sprintf('\
				blockquote:before { content: "引用:"; display: block; margin-bottom: 2px; padding: 0 2px; font-size: 75%; line-height: 1.5; background-color: %(sMainHeaderBgColor)s; color: %(sMainHeaderFontColor)s; } \
				td > blockquote { border-right-width: 1px; } \
				blockquote { margin: 0 0 5px 0; border: 1px solid %(sMainBorderColor)s; border-right-width: 0; } \
				blockquote > div { padding: 0 0 5px 2px; } \
				.an-hiddenquote { display: none; } \
				', AN.util.getOptions()));
			break;
		}
	},
	infinite: function(jDoc)
	{
		var placeHolder = $('#ctl00_ContentPlaceHolder1_view_form')[0];
		var level = AN.util.getOptions('quoteMaskLevel') - 1;
		if(level < 0) return;
		
		jDoc.replies().jContents.find('blockquote').filter(function(){ return $(this).parentsUntil(placeHolder, 'blockquote').length === level; }).addClass('an-hiddenquote');
	}
},

'cb1917f9-4053-40b1-870d-e0e2c6a90b39':
{
	desc: '改變快速回覆的風格',
	page: { 32: true },
	type: 8,
	options:
	{
		sQRHideMethod: { desc: '隱藏方式', type: 'select', choices: ['完全隱藏', '隱藏於中下方, 懸浮切換顯示', '隱藏於中下方, 點擊切換顯示', '隱藏於右下角'], defaultValue: '隱藏於中下方, 點擊切換顯示' },
		nQROpacity: { desc: '透明度 (10 = 移除半透明)', type: 'select', defaultValue: 10, choices: [10,9,8,7,6,5,4,3,2,1,0] }
	},
	once: function()
	{
		if(!AN.util.isLoggedIn()) return;

		var jQR = $('#newmessage');
		var nWidth = 938; //jQR.width() + 1;
		var nRight = 50 - nWidth;
		
		var sMethod = AN.util.getOptions('sQRHideMethod');
		var aChoices = this.options.sQRHideMethod.choices;

		AN.util.stackStyle($.sprintf('\
		#newmessage { %s; z-index: 3; position: fixed; width: %spx; bottom: 0px; right: %spx; } \
		#an-qr-header { cursor: pointer; text-align: center; } \
		#previewArea { display: block; overflow: auto; width: %spx; } \
		#previewArea img[onload] { max-width: 300px; } \
		',
		AN.util.getOpacityStr(AN.util.getOptions('nQROpacity')),
		nWidth,
		sMethod == aChoices[3] ? nRight : Math.ceil(($.winWidth() - nWidth) / 2),
		nWidth - 149
		));
		
		var jToggle = (sMethod == aChoices[0] ? jQR : jQR.find('tr:eq(2)')).hide();
		
		var isNotNeeded = function(bToShow)
		{
			return typeof bToShow == 'boolean' && bToShow == (jToggle.css('display') != 'none');
		};

		var isToShow = function(bToShow)
		{
			return typeof bToShow == 'boolean' ? bToShow : jToggle.css('display') == 'none';
		};
		
		var toggleQR = function(bToShow, fCallback)
		{
			if(isNotNeeded(bToShow)) return;

			jToggle.toggle(isToShow(bToShow));
			$('#previewArea').empty();
			if(fCallback) fCallback();
		};
		
		if(sMethod == aChoices[3])
		{
			toggleQR = (function(_toggleQR)
			{
				return function(bToShow)
				{
					if(isNotNeeded(bToShow)) return;

					isToShow(bToShow) ? jQR.animate({ right: Math.ceil(($.winWidth() - nWidth) / 2) }, 'slow', _toggleQR) : _toggleQR(false, function(){ jQR.animate({ right: nRight }, 'slow'); });
				};
			})(toggleQR);
		}
		
		var jQRHeader = jQR.find('td:eq(1)').attr('id', 'an-qr-header').html('快速回覆');
		
		sMethod == aChoices[1] ? jQR.bind('mouseenter mouseleave', toggleQR) : jQRHeader.click(toggleQR);

		$('#aspnetForm').submit(function()
		{
			toggleQR(false);
		});

		window._OnQuoteSucceeded = function(result)
		{
			toggleQR(true);
			$('#ctl00_ContentPlaceHolder1_messagetext').val(unescape(result) + '\n').scrollTop(99999);
			window.moveEnd();
		};
		
		window.OnQuoteSucceeded = new window.Function('result', 'window._OnQuoteSucceeded(result);');
		
		window.doPreview = (function(_doPreview)
		{
			var jPreview = $('#previewArea');
			
			return function()
			{
				jPreview.css('max-height', $.winHeight() - jQR.height() - jPreview.height());
				_doPreview();
			};
		})(window.doPreview);
	}
}

}};