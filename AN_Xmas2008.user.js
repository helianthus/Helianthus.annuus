/*
    Copyright (C) 2008  向日

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// ==UserScript==
// @name Helianthus.Annuus: Xmas 2008
// @namespace http://forum.hkgolden.com/
// @description version 2.x.x_alpha by 向日
// @include http://forum*.hkgolden.com/*
// ==/UserScript==

/////////////////// START OF - [Preperation] ///////////////////

if(typeof unsafeWindow != 'undefined')
{
	$window = unsafeWindow;
	$ = $window.$;
	AN = $window.AN;
}

(function()
{
	if(!AN.data) return setTimeout(arguments.callee, 500);
	AN.init.xmas2008();
})();

/////////////////// END OF - [Preperation] ///////////////////
/////////////////// START OF - [Xmas 2008] ///////////////////

AN.init.xmas2008 = function()
{
	$('#ctl00_TopBarHomeImage').attr('src', 'http://i3.6.cn/cvbnm/93/04/af/f1cb3700665e79e2d73a6392b585ef19.jpg');

	if($('#ctl00_ContentPlaceHolder1_QuickReplyTable').get(0))
	{
		var oMap =
		{
			'O:-)': 'http://i147.photobucket.com/albums/r296/watashi101/XmasGoldenIcon/angel_xmas.gif',
			'xx(': 'http://e.imagehost.org/0069/dead_xmas.gif',
			':)': 'http://e.imagehost.org/0720/th_e643de0b.gif',
			':o)': 'http://i147.photobucket.com/albums/r296/watashi101/XmasGoldenIcon/clown_xmas.gif',
			':-(': 'http://i147.photobucket.com/albums/r296/watashi101/XmasGoldenIcon/frown_xmas.gif',
			':~(': 'http://i411.photobucket.com/albums/pp199/goldenphotos_2008/cry-christmas.gif',
			//';-)': '',
			':-[': 'http://i436.photobucket.com/albums/qq89/dorkep/xmasangry-1.gif',
			':-]': 'http://e.imagehost.org/0471/devil_xmas.gif',
			':D': 'http://e.imagehost.org/0814/smile_xmas.gif',
			':O': 'http://i436.photobucket.com/albums/qq89/dorkep/xmasoh.gif',
			':P': 'http://e.imagehost.org/0173/tongue_xmas.gif',
			'^3^': 'http://e.imagehost.org/0267/kiss_xmas.gif',
			'?_?': 'http://i262.photobucket.com/albums/ii110/swirlwind/xmas/wonder_xmas.gif',
			'#yup#': 'http://www.fotoc.com/abalone/d/1600-1/agree.gif',
			//'#ng#': '',
			'#hehe#': 'http://e.imagehost.org/0092/hehe.gif',
			'#love#': 'http://i326.photobucket.com/albums/k420/whiteplastic1999/love.gif',
			//'#oh#': '',
			'#cn#': 'http://i350.photobucket.com/albums/q408/hkgd_tama/turkey_xmas.gif',

			'#ass#': 'http://i350.photobucket.com/albums/q408/hkgd_tama/ass_xmas.gif',
			'[sosad]': 'http://i350.photobucket.com/albums/q408/hkgd_tama/sosad_xmas.gif',
			'#good#': 'http://vstlod.simpload.com/goodest.png',
			'#hoho#': 'http://i326.photobucket.com/albums/k420/whiteplastic1999/hoho2.gif',
			'#kill#': 'http://ranobe.com/up/src/up325152.gif',
			'#bye#': 'http://i411.photobucket.com/albums/pp199/goldenphotos_2008/bye-christmas.gif',
			//'Z_Z': '',
			'@_@': 'http://i411.photobucket.com/albums/pp199/goldenphotos_2008/-christmas.gif',
			'#adore#': 'http://img.photobucket.com/albums/v93/sanem9283/xmas_adore.gif',
			//'???': '',
			'[banghead]': 'http://i350.photobucket.com/albums/q408/hkgd_tama/banghead_xmas.gif',
			'[bouncer]': 'http://i230.photobucket.com/albums/ee105/hihithem/xbouncer.gif',
			'[bouncy]': 'http://i262.photobucket.com/albums/ii110/swirlwind/xmas/bouncy_xmas.gif',
			'[offtopic]': 'http://e.imagehost.org/0356/offtopic.gif',

			'[censored]': 'http://i411.photobucket.com/albums/pp199/goldenphotos_2008/censored_xmas2.gif',
			'[flowerface]': 'http://i230.photobucket.com/albums/ee105/hihithem/xflower.gif',
			'[shocking]': 'http://i369.photobucket.com/albums/oo132/PEANUTPLASTIC/SHOCKMAS2.gif',
			'[photo]': 'http://ranobe.com/up/src/up325161.gif',
			//'#fire#': '',
			'[yipes]': 'http://money-printer.org/image/pics/e1fdd2842dc93b4b98ab2bb4ffd277b4.gif',
			'[369]': 'http://i147.photobucket.com/albums/r296/watashi101/XmasGoldenIcon/369_xmas.gif',
			//'[bomb]': '',
			'[slick]': 'http://e.imagehost.org/0058/slick_xmas.gif',
			'fuck': 'http://i147.photobucket.com/albums/r296/watashi101/XmasGoldenIcon/fk_xmas.gif',
			'#no#': 'http://i262.photobucket.com/albums/ii110/swirlwind/xmas/no_xmas.gif',
			'#kill2#': 'http://i326.photobucket.com/albums/k420/whiteplastic1999/kill2.gif'
		}

		$('#ctl00_ContentPlaceHolder1_QuickReplyTable').find('img').each(function()
		{
			if(oMap[this.alt])
			{
				$(this)
				.removeAttr('width')
				.removeAttr('height')
				.attr('src', oMap[this.alt])
				.parent().attr('href', 'javascript:InsertText(\'[img]' + oMap[this.alt] + '[/img]\', false)');
			}
		});
	}
}

/////////////////// END OF - [Xmas 2008] ///////////////////





















