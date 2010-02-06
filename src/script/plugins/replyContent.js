$.extend(an.plugins, {

'7b36188f-c566-46eb-b48d-5680a4331c1f':
{
	desc: '轉換論壇連結的伺服器位置',
	pages: { on: [view] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			var rForum = /forum\d*.hkgolden\.com/i;
			$d.mousedown(function(event)
			{
				var jTarget = $(event.target);
				if(!( jTarget.is('.repliers_right > tbody > tr:first-child a') && rForum.test(jTarget.attr('href')) )) return;

				jTarget.attr('href', jTarget.attr('href').replace(rForum, location.hostname));
			});
		}
	}]
},

'e33bf00c-9fc5-46ab-866a-03c4c7ca5056':
{
	desc: '轉換文字連結成連結',
	pages: { on: [view] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.ss('.an-linkified { padding: 0 2px; }');
		}
	},
	{
		type: always,
		fn: function(job)
		{
			var
			rLink = /(?:https?|ftp):\/\/(?:[\w-]+\.)+[a-z]{2,3}(?![a-z])(?:\/[\w.\/?:;~!@#$%^&*()+=-]*)?/i,
			rSkip = /^(?:a|button|script|style)$/i;

			$j.replies().jContents.each(function()
			{
				if(rLink.test($(this).text())) {
					var node, match, next = this.firstChild;
					while(node = next) {
						if(node.nodeType === 3 && (match = rLink.exec(node.data))) {
							node.splitText(match.index + match[0].length);

							$(node.splitText(match.index))
							.before('<img title="已轉換文字為連結" class="an-linkified" src="'+an.resources['chain--arrow']+'" />')
							.wrap($.format('<a href="{0}"></a>', match[0]));

							node = node.nextSibling.nextSibling;
						}

						next = !rSkip.test(node.nodeName) && node.firstChild || node.nextSibling;
						while(!next && (node = node.parentNode)) {
							if(node === this) break;
							next = node.nextSibling;
						}
					}
				}
			});
		}
	}]
},

'422fe323-e61e-47d9-a348-d40011f5da28':
{
	desc: '連結封鎖功能',
	pages: { off: [view] },
	type: 6,
	queue: [{
		fn: function(job)
		{
			$.ss('\
			.repliers_right a[target] { display: inline-block; } \
			a[href].an-linkblocked { text-decoration: line-through; font-style: italic; cursor: default; } \
			a[target].an-linkblocked:before { content: attr(rel); } \
			a[target].an-linkblocked > img { display: none; } \
			#an-linkblocktoggler { margin: -16px 0 0 -34px; padding: 16px; padding-right: 2px; } \
			');

			var
			blockList = job.db('linkBlockList') || [],
			rInternal = /^http:\/\/(?:[^.]+.)hkgolden\.com/,

			jButton = $('<img />', { id: 'an-linkblocktoggler' })
			.hoverize('.repliers_right > tbody > tr:first-child a', {
				filter: function(){ return $(this).hasClass('an-linkblocked') || !rInternal.test(this.href); },
				fixScroll: 'top'
			})
			.bind({
				entertarget: function()
				{
					jButton.attr('src', an.resources[jButton.data('hoverize').jTarget.hasClass('an-linkblocked') ? 'tick-shield' : 'cross-shield']);
				},
				click: function()
				{
					var
					jTarget = jButton.data('hoverize').jTarget,
					isBlocked = jTarget.hasClass('an-linkblocked'),
					hrefAttr = isBlocked ? 'rel' : 'href',
					realHref = jTarget.attr(hrefAttr),
					jLinks = $(document).replies().jContents.find('a').filter(function(){ return this[hrefAttr] === realHref; }).toggleClass('an-linkblocked');

					if(isBlocked) {
						jLinks.attr({ href: realHref });
						blockList.splice($.inArray(realHref, blockList), 1);
					}
					else {
						jLinks.attr({ href: 'javascript:', rel: realHref });
						blockList.push(realHref);
					}

					job.db('linkBlockList', blockList);
				}
			});

			$.prioritize(always, function()
			{
				$j.replies().jContents.find('a').filter(function(){ return $.inArray(this.href, blockList) !== -1; }).toggleClass('an-linkblocked').each(function()
				{
					$(this).attr({ href: 'javascript:', rel: this.href });
				});
			});
		}
	}]
},

'd761d6f7-8ef7-4d5b-84e9-db16a274f616':
{
	desc: '轉換圖片連結成圖片',
	pages: { on: [view] },
	type: 6,
	options: {
		imageConvertMode: { desc: '轉換模式', type: 'select', choices: ['自動轉換', '自動轉換(引用中的連結除外)', '手動轉換'], defaultValue: '手動轉換' }
	},
	queue: [{
		fn: function(job)
		{
			$.ss('\
			.an-imagified { padding: 0 2px; } \
			.an-imagified + a[href] { display: block; } \
			');

			var rImg = /\.(?:jpe?g|gif|png|bmp)\b/i;

			$d.bind('click imageconvert', function(event)
			{
				var jTarget = $(event.target);
				if(jTarget.next('.an-imagified').length) {
					event.preventDefault();
					jTarget.next().next().toggle();
				}
				else if(jTarget.children().length === 0 && (event.type === 'imageconvert' || jTarget.is('.repliers_right > tbody > tr:first-child a')) && rImg.test(event.target.href)) {
					event.preventDefault();

					jTarget.after($.format(
					'<img title="已轉換連結為圖片" class="an-imagified" src="{0}" /><a href="{1}" target="_blank"><img onload="DrawImage(this)" src="{1}" alt="[img]{1}[/img]" /></a>',
					an.resources['image-export'], event.target.href));
				}
			});

			var convertMode = $.inArray(job.options('imageConvertMode'), job.plugin.options.imageConvertMode.choices);
			if(convertMode !== 2) $.prioritize(always, function()
			{
				$j.replies().jContents.find(convertMode === 0 ? 'a' : 'a:not(blockquote a)').trigger('imageconvert');
			});
		}
	}]
},

'8e1783cd-25d5-4b95-934c-48a650c5c042':
{
	desc: '圖片屏蔽功能',
	pages: { off: [view] },
	type: 6,
	options: {
		imageMaskMode: { desc: '屏蔽模式', type: 'select', choices: ['自動屏蔽', '自動屏蔽(只限引用中的圖片)', '手動屏蔽'], defaultValue: '自動屏蔽(只限引用中的圖片)' }
	},
	queue: [{
		fn: function(job)
		{
			var maskMode = $.inArray(job.options('imageMaskMode'), job.plugin.options.imageMaskMode.choices);
			var selector = {
				0: '.repliers_right img[onload],',
				1: '.repliers_right blockquote img[onload],',
				2: ''
			}[maskMode];

			$.ss(selector + 'img[onload].an-maskedImage { padding: 52px 48px 0 0; width: 0; height: 0; background: url('+an.resources['gnome-mime-image-bmp']+') no-repeat; }');

			if(maskMode !== 2) {
				$.ss('img[src][onload].an-unmaskedImage { padding: 0; width: auto; height: auto; background: none; }');
			}

			var jButton = $('<img />', { src: an.resources['picture--minus'], css: { 'margin-top': '-2px' } })
			.hoverize('.repliers_right img[onload]', { filter: function(){ return $(this).width(); } })
			.click(function()
			{
				jButton.data('hoverize').jTarget.addClass('an-maskedImage').removeClass('an-unmaskedImage');
			});

			$d.bind('click', function(event)
			{
				var jTarget = $(event.target);
				if(jTarget.is('img[onload]') && jTarget.width() === 0) {
					event.preventDefault();
					jTarget.addClass('an-unmaskedImage').removeClass('an-maskedImage').mouseover();
				}
			});
		}
	}]
},

'039d820f-d3c7-4539-8647-dde974ceec0b':
{
	desc: '轉換視頻網站連結成影片',
	pages: { on: [view] },
	type: 6,
	options: {
		videoConvertMode: { desc: '轉換模式', type: 'select', choices: ['自動轉換', '自動轉換(引用中的連結除外)', '手動轉換'], defaultValue: '自動轉換(引用中的連結除外)' }
	},
	queue: [{
		fn: function(job)
		{
			var nWidth, nHeight, sUrl;
			var aSites =
			[{
				regex: 'youtube\\.com/watch\\?v=',
				fn: function(job)
				{
					if(nWidth > 640) nWidth = 640;
					nHeight = nWidth / 16 * 9 + 25;
					sUrl = $.format('http://www.youtube.com/v/{0}&fs=1&rel=0', sUrl.replace(/.+?v=([^&]+).*/i, '$1'));
				}
			},
			{
				regex: 'vimeo\\.com/\\d',
				fn: function(job)
				{
					if(nWidth > 504) nWidth = 504;
					nHeight = nWidth / 1.5;
					sUrl = $.format('http://vimeo.com/moogaloop.swf?clip_id={0}&show_title=1&fullscreen=1', sUrl.replace(/.+vimeo\.com\/(\d+).*/i, '$1'));
				}
			},
			{
				regex: 'youku\\.com/v_show/',
				fn: function(job)
				{
					if(nWidth > 480) nWidth = 480;
					nHeight = nWidth / 4 * 3 + 40;
					sUrl = $.format('http://player.youku.com/player.php/sid/{0}/v.swf', sUrl.replace(/.+?id_([^\/]+).*/i, '$1'));
				}
			},
			{
				regex: 'tudou\\.com/programs/',
				fn: function(job)
				{
					if(nWidth > 420) nWidth = 420;
					nHeight = nWidth / 4 * 3 + 48;
					sUrl = $.format('http://www.tudou.com/v/{0}', sUrl.replace(/.+?view\/([^\/]+).*/i, '$1'));
				}
			}];
			var rLink = (function()
			{
				var aReg = [];
				$.each(aSites, function(){ aReg.push(this.regex); });
				return new RegExp(aReg.join('|'), 'i');
			})();

			$.ss('\
			.an-videoified { padding: 0 2px; } \
			.an-videoified + object { display: block; outline: 0; } \
			');

			$d.bind('click videoconvert', function(event)
			{
				var jTarget = $(event.target);
				if(jTarget.next('.an-videoified').length) {
					event.preventDefault();
					jTarget.next().next().toggle();
				}
				else if((event.type === 'videoconvert' || jTarget.is('.repliers_right > tbody > tr:first-child a')) && rLink.test(event.target.href)) {
					event.preventDefault();

					sUrl = event.target.href;
					nWidth = jTarget.up('td,div').width();
					$.each(aSites, function()
					{
						if(RegExp(this.regex, 'i').test(sUrl)) {
							this.fn();
							return false;
						}
					});

					$('<div></div>')
					.insertAfter(jTarget)
					.toFlash(sUrl, { width: nWidth, height: nHeight.toFixed(0) }, { wmode: 'opaque', allowfullscreen: 'true' })
					.before('<img title="已轉換連結為影片" class="an-videoified" src="'+an.resources['film--arrow']+'" />');
				}
			});

			var convertMode =  $.inArray(job.options('videoConvertMode'), job.plugin.options.videoConvertMode.choices);
			if(convertMode !== 2) $.prioritize(always, function()
			{
				$j.replies().jContents.find(convertMode === 0 ? 'a' : 'a:not(blockquote a)').trigger('videoconvert');
			});
		}
	}]
}

});