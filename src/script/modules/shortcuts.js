annuus.addModules({

'4a263d1b-4c3d-48a0-afc9-a63f13381aa3':
{
	title: '加入吹水台按扭',
	pages: { on: [all] },
	tasks: {
		'e6d2ea58': {
			service: 'button',
			uuid: 'ed7a9b3c-f63b-44c1-a942-ac2b8355e207',
			insert: true,
			title: '吹水台',
			href: '/topics.aspx?type=BW'
		}
	}
},

'29aeaf94-db3a-4b88-8c5a-cbd2113beba6':
{
	title: '加入最頂/最底按扭',
	pages: { on: [all] },
	tasks: {
		'e6d2ea58': {
			service: 'button',
			uuid: '47396980-091c-4a69-b69d-e5e0edc9910e',
			title: '最頂／最底',
			widget: function()
			{
				return $('<div/>')
				.append($('<a/>', { text: '最頂' }).button())
				.append($('<a/>', { text: '最底' }).button())
				.delegate('.ui-button', 'click', function()
				{
					document.documentElement.scrollIntoView($(this).index() === 0);
				});
			}
		}
	}
},

'de06fe96-6073-44e7-bf53-c14a51bdf58f':
{
	title: '加入轉台按扭',
	pages: { on: [all] },
	tasks: {
		'e6d2ea58': {
			service: 'button',
			uuid: 'c2a14609-7b55-4a71-9c06-ecc23eaba1ac',
			title: '轉台',
			widget: function(self)
			{
				var widget = $('<div/>');

				$.each([
					['主論壇頁', null],
					['娛樂台', 'ET'],
					['時事台', 'CA'],
					['財經台', 'FN'],
					['遊戲台', 'GM'],
					['硬件台', 'HW'],
					['寬頻台', 'IN'],
					['軟件台', 'SW'],
					['手機台', 'MP'],
					['體育台', 'SP'],
					['感情台', 'LV'],
					['講故台', 'SY'],
					['飲食台', 'ED'],
					['旅遊台', 'TR'],
					['潮流台', 'CO'],
					['動漫台', 'AN'],
					['玩具台', 'TO'],
					['音樂台', 'MU'],
					['影視台', 'VI'],
					['攝影台', 'DC'],
					['學術台', 'ST'],
					['汽車台', 'TS'],
					['電　台', 'RA'],
					['站務台', 'MB'],
					['自組活動台', 'AC'],
					['創意台', 'EP'],
					['吹水台', 'BW']
				], function(i, item)
				{
					$('<a/>', {
						text: item[0],
						href: item[1] === null ? '/' : 'topics.aspx?type=' + item[1]
					}).button().appendTo(widget);
				});

				return widget;
			}
		}
	}
}

});
