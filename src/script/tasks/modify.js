$.extend(an.tasks, {

'b6b232c8-1f26-449e-bb0d-2b7826bf95ef':
{
	desc: '去除論壇原有的圖片縮小功能',
	pages: { on: [view, profilepage | sendpm] },
	type: modify,
	queue: [{
		priority: 1,
		js: function()
		{
			$.rules('\
			.repliers_right a[target] { display: inline-block; max-width: 100% } \
			.repliers_right img[onload] { width: auto; height: auto; max-width: 100% } \
			.repliers_right > tbody > tr:first-child a[target]:focus { outline: 0; } \
			');
		}
	},
	{
		js: function(job)
		{
			window.DrawImage = $.noop;
		}
	}]
},

'd7adafa8-cc14-45f9-b3e9-bc36eab05d4f':
{
	desc: '縮小引用中的圖片',
	pages: { off: [view] },
	type: modify,
	options: { nQuoteImgMaxHeight: { desc: '圖片最大高度(px)', defaultValue: 100, type: 'text' } },
	queue: [{
		priority: 1,
		js: function(job)
		{
			$.rules('.repliers_right blockquote img[onload] { width: auto; height: auto; max-height: {0}px; }', job.options('nQuoteImgMaxHeight'));
		}
	}]
},

'52ebe3d3-bf98-44d2-a101-180ec69ce290':
{
	desc: '移除帖子連結高亮部份',
	pages: { off: [profilepage] },
	type: modify,
	queue: [{
		priority: 1,
		js: function(job)
		{
			var regex = /&highlight_id=\d+/;
			$d.delegate('a', 'mouseover', function()
			{
				if(regex.test(this.href)) {
					this.href = this.href.replace(regex, '');
				}
			});
		}
	}]
},

'87a6307e-f5c2-405c-8614-af60c85b101e':
{
	desc: '搜尋開新頁',
	pages: { off: [topics, search | tags] },
	type: modify,
	queue: [{
		js: function(job)
		{
			window.Search = function()
			{
				var
				type = $('#st').val(),
				query = escape($('#searchstring').val());

				window.open(type == 'tag' ? 'tags.aspx?tagword='.concat(query) : $.format('search.aspx?st={0}&searchstring={1}', type, query), '_blank');

				$('#searchstring').val('');
			};
		}
	}]
},

'a93f1149-d11b-4b72-98dd-c461fd9ee754':
{
	desc: '連結開新頁',
	pages: { off: [topics, search | tags, profilepage] },
	type: modify,
	options: { bTopicLinksOnly: { desc: '只限帖子連結', defaultValue: false, type: 'checkbox' } },
	queue: [{
		priority: 6,
		js: function(job)
		{
			$d.delegate('a', 'click', function(event)
			{
				if(!event.isDefaultPrevented() && $(this).attrFilter('href',  job.options('bTopicLinksOnly') && /view\.aspx/, /^#|^javascript|topics\.aspx/).length) {
					event.preventDefault();
					window.open(this.href, '_blank');
				}
			});
		}
	}]
},

'2ab2f404-0d35-466f-98a5-c88fdbdaa031':
{
	desc: '外鏈連結開新頁',
	pages: { on: [view] },
	type: modify,
	queue: [{
		priority: 6,
		js: function(job)
		{
			$d.delegate('a', 'click', function(event)
			{
				if(!event.isDefaultPrevented() && $(this).isReplyContent()) {
					event.preventDefault();
					window.open(this.href, '_blank');
				}
			});
		}
	}]
},

'b73d2968-8301-4c5e-8700-a89541d274fc':
{
	desc: '回復傳統用戶連結',
	pages: { off: [view] },
	type: modify,
	queue: [{
		priority: 1,
		js: function(job)
		{
			$d.delegate('a', 'mouseover', function()
			{
				if(this.href.indexOf('ToggleUserDetail') !== -1) {
					this.href = '/ProfilePage.aspx?userid=' + $(this).up('tr').attr('userid');
				}
			});
		}
	}]
},

'6e978310-e87b-4043-9def-076a13377c19':
{
	desc: '更換favicon(小丑icon) [部份瀏覽器無效]',
	pages: { off: [normal] },
	type: modify,
	queue: [{
		priority: 1,
		js: function(job)
		{
			$('<link>', { rel: 'shortcut icon', href: 'http://helianthus-annuus.googlecode.com/svn/other/hkg.ico' }).appendTo('head');
		}
	}]
},

'e54d5c5f-47ae-4839-b4e8-6fc3733edfef':
{
	desc: '改進公司模式',
	pages: { on: [normal] },
	type: modify,
	options:
	{
		sCModeFavicon: { desc: 'favicon連結位置 [部份瀏覽器無效]', defaultValue: 'http://www.google.com/favicon.ico', type: 'text' },
		sCModeTitle: { desc: '標題名稱', defaultValue: 'Google', type: 'text' }
	},
	queue: [{
		priority: 1,
		js: function(job)
		{
			if($.cookie('companymode') == 'Y') {
				$('<link>', { rel: 'shortcut icon', href: job.options('sCModeFavicon') }).appendTo('head');
				document.title = job.options('sCModeTitle');
			}
		}
	}]
}

});