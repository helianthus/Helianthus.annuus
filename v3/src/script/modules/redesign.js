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
		AN.util.stackStyle('blockquote + br { display: none; }');
		
		var
		styleNo = this.styleNo = $.inArray(AN.util.getOptions('quoteStyle'), this.options.quoteStyle.choices),
		placeHolder = this.placeHolder = $('#ctl00_ContentPlaceHolder1_view_form')[0],
		jCurTarget = $(),
		jButton;
		
		switch(styleNo) {
			case 0:
				AN.util.stackStyle('\
				blockquote { margin: 0 0 8px 1px; padding: 0 0 7px 40px; } \
				.an-hiddenquote { padding-left: 0; } \
				.an-hiddenquote:before { content: url("'+ $r['balloon--plus'] +'"); } \
				.an-hiddenquote > div { display: none; } \
				');
				
				jButton = $('<img style="display: none; position: absolute; cursor: pointer;" />');
				
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
				.an-quotetogglebutton { display: none; margin: -18px 0 0 -4px; cursor: pointer; } \
				.an-quotetogglebutton, blockquote:before { position: absolute; color: #999; } \
				blockquote:before { content: ""; width: 20px; height: 20px; top 0; left: -4px; margin-top: -18px; } \
				td > blockquote { margin: 15px 0 10px 3px; } \
				blockquote { position: relative; margin: 0 0 10px 0; } \
				blockquote > div { border-left: 2px solid #999; padding-left: 5px; } \
				.an-hiddenquote:before { content: "+"; } \
				.an-hiddenquote > div > blockquote { display: none; } \
				');
				
				jButton = $('<span class="an-quotetogglebutton"></span>');
				
				$d.mouseover(function(event)
				{
					if(event.target === jButton[0]) return;
					
					jCurTarget = $(event.target).closest('blockquote', placeHolder);
					if(jCurTarget.children().children('blockquote').length) {
						jButton.text(jCurTarget.hasClass('an-hiddenquote') ? '+' : '--').css(jCurTarget.offset()).show();
					}
					else {
						jButton.hide();
					}
				});
			break;
			case 2:
				AN.util.stackStyle($.sprintf('\
				.an-quotetogglebutton { display: none; position: absolute; margin: 2px 0 0 -15px; font-weight: bold; cursor: pointer; } \
				.an-quotetogglebutton, blockquote:before, .an-hiddenquote:after { font-size: 12px; color: %(sMainHeaderFontColor)s; } \
				blockquote:before { content: "引用:"; display: block; margin-bottom: 2px; padding-left: 3px; line-height: 1.3; background-color: %(sMainHeaderBgColor)s; } \
				td > blockquote { border-right-width: 1px; } \
				blockquote { margin: 0 0 5px 0; border: 1px solid %(sMainBorderColor)s; border-right-width: 0; } \
				blockquote > div { padding: 0 0 5px 2px; } \
				.an-hiddenquote { position: relative; } \
				.an-hiddenquote:after { content: "＋"; position: absolute; top: 1px; right: 3px; font-weight: bold; } \
				.an-hiddenquote > div > blockquote { display: none; } \
				', AN.util.getOptions()));
				
				jButton = $($.sprintf('<span class="an-quotetogglebutton"></span>', AN.util.getOptions()));
				
				$d.mouseover(function(event)
				{
					if(event.target === jButton[0]) return;
					
					jCurTarget = $(event.target).closest('blockquote', placeHolder);
					if(jCurTarget.children().children('blockquote').length) {
						var offset = jCurTarget.offset();
						jButton.text(jCurTarget.hasClass('an-hiddenquote') ? '＋' : '－').css({ top: offset.top, left: offset.left + jCurTarget.width() }).show();
					}
					else {
						jButton.hide();
					}
				});
			break;
		}
		
		jButton.appendTo('#an').click(function(event)
		{
			jCurTarget.toggleClass('an-hiddenquote');
			jButton.hide();
		});
	},
	infinite: function(jDoc)
	{
		var placeHolder = this.placeHolder;
		var level = AN.util.getOptions('quoteMaskLevel') - (this.styleNo === 0 ? 1 : 2);
		if(level < 0) return;
		
		jDoc.replies().jContents
		.find(this.styleNo === 0 ? 'blockquote' : 'blockquote:has(blockquote)')
		.filter(function(){ return $(this).parentsUntil(placeHolder, 'blockquote').length === level; })
		.addClass('an-hiddenquote');
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

		var
		hideMode = $.inArray(AN.util.getOptions('sQRHideMethod'), this.options.sQRHideMethod.choices),
		jQR = $('#newmessage'),
		jQRHeader = jQR.find('td:eq(1)').attr('id', 'an-qr-header').html('快速回覆'),
		jToggle = (hideMode === 0 ? jQR : jQR.find('tr:eq(2)')).hide(),
		jPreview = $('#previewArea'),
		jTextarea = $('#ctl00_ContentPlaceHolder1_messagetext'),
		nWidth = 938, //jQR.width() + 1,
		nRight = 50 - nWidth;

		AN.util.stackStyle($.sprintf('\
		#newmessage { %s; z-index: 3; position: fixed; width: %spx; bottom: 0px; right: %spx; } \
		#an-qr-header { cursor: pointer; text-align: center; } \
		#previewArea { display: block; overflow: auto; width: %spx; } \
		#previewArea img[onload] { max-width: 300px; } \
		',
		AN.util.getOpacityStr(AN.util.getOptions('nQROpacity')),
		nWidth,
		hideMode === 3 ? nRight : Math.ceil(($.winWidth() - nWidth) / 2),
		nWidth - 149
		));
		
		function toggleQR(toShow, callback)
		{
			var isVisible = jToggle.is(':visible');
			if(toShow === undefined) toShow = !isVisible;
			else if(isVisible === toShow) return;
			
			function toggle()
			{
				jPreview.empty();
				jToggle.toggle(toShow);
				if(toShow) {
					window.moveEnd();
					jTextarea.scrollTop(99999);
				}
			}
			
			if(hideMode === 3) {
				if(toShow) {
					jQR.animate({ right: Math.ceil(($.winWidth() - nWidth) / 2) }, 'slow', toggle);
				}
				else {
					toggle();
					jQR.animate({ right: nRight }, 'slow');
				}
			}
			else {
				toggle();
			}
		};
		
		hideMode === 1
		? jQR.bind('mouseenter mouseleave', function(event){ toggleQR(event.type === 'mouseenter'); })
		: jQRHeader.click(function(){ toggleQR(); });

		$('#aspnetForm').submit(function()
		{
			toggleQR(false);
		});

		window.OnQuoteSucceeded = function(result)
		{
			toggleQR(true);
			jTextarea.val(unescape(result) + '\n');
		};
		
		window.doPreview = (function(_doPreview)
		{
			return function()
			{
				_doPreview();
				jPreview.css('max-height', $.winHeight() - jQR.height() - jPreview.height());
			};
		})(window.doPreview);
	}
}

}};