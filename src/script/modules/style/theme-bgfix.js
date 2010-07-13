annuus.addModules({

'8e08db0d-3c7b-418d-a873-6901f37c497f':
{
	title: 'Theme Service (with background fix)',
	pages: { comp: [all] },
	requires: ['theme'],
	tasks: {
		'5c6e7d7d': {
			type: 'service',
			name: 'theme-bgfix',
			run_at: 'document_start',
			init: function(self, jobs)
			{
				if(!jobs.length) {
					return;
				}

				$.rules('\
					.TopMenuPanel, .PageMiddleBox, .bg_top, .bg_main { background-image: none; } \
					.TopMenuBox, .TopMenuPanel + div.PageWidthContainer, table[width="955"] > tbody > tr:first-child { display: none; } \
					.bg_top { height: auto; } \
					\
					#ctl00_TopBarHomeImage { width: 0 !important; height: 0 !important; } \
				');

				$.digEach({
					'': [
						['/images/index_images/logo.jpg', 220, 115, 'logo'],
						['/images/left_menu/redhotp.jpg', 22, 21, 'redhotp'],
						['/images/index_images/p2.jpg', 22, 21, 'p2'],
						['images/bb_bookmarks/add.gif', 18, 18, 'plus-octagon'],
						['images/bb_bookmarks/delete.gif', 18, 18, 'cross-octagon'],
						['images/bb_bookmarks/add2.gif', 18, 18, 'plus-small'],
						['images/bb_bookmarks/delete2.gif', 18, 18, 'cross-small'],
						['images/bb_bookmarks/minimize.gif', 18, 18, 'minus-small'],
						['/images/bb_bookmarks/bookmark.gif', 18, 18, 'bookmark'],
						['/images/bb_bookmarks/profile.gif', 18, 18, 'user'],
						['/images/bb_bookmarks/blog.gif', 18, 18, 'blog'],
						['/images/bb_bookmarks/bookmark_hot.gif', 18, 18, 'bookmark--exclamation'],
						['/images/bb_bookmarks/block.gif', 18, 18, 'cross-shield'],
						['images/new.gif', 13, 16, 'new'],
						['images/leftjust.gif', 18, 18, 'leftjust'],
						['images/centered.gif', 18, 18, 'centered'],
						['images/rightjust.gif', 18, 18, 'rightjust']
					],
					'$': [
						['/images/bulbs/bluebulb.gif', 21, 30, 'bluebulb'],
						['/images/bulbs/pinkbulb.gif', 21, 30, 'pinkbulb'],
						['images/left_menu/p.jpg', 22, 21, 'p'],
						['/faces/beer.gif', 16, 16, 'beer']
					]
				}, null, null, function(symbol, i, info)
				{
					$.rules('img[src][src][src{0}="{1[0]}"] { padding: 0 {1[1]}px {1[2]}px 0; width: 0; height: 0; background: url("{2.data(images)[{1[3]}]}") no-repeat center; }', symbol, info, self);
				});

				$.service.theme.add(jobs);
			}
		}
	}
}

});
