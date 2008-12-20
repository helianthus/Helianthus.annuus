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
// @name Helianthus.Annuus: Rubbish Remover
// @namespace http://code.google.com/p/helianthus-annuus/
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

/////////////////// END OF - [Preperation] ///////////////////
/////////////////// START OF - [Rubbish Removal] ///////////////////

AN.removeRubbish = function()
{
	//$('#Side_GoogleAd ~ *').remove();
	$('#HKGTopAd').remove();

	switch(AN.data.strCurPage)
	{
		case 'topics':
		case 'search':
		case 'newmessages':
			$('#ctl00_ContentPlaceHolder1_lb_UserName').parents('tr:eq(1)').find('tr:last').remove();
			$('#MainPageAd2').parents('tr:eq(1)').prev().andSelf().remove();
			$('#MainPageAd1').parents('td:first').prev().andSelf().remove();

			$('[id^=MsgInLineAd]').each(function(){ $(this).parents('tr:first').remove(); });
			$('#HKGBottomGoogleAd').parents('table:eq(1)').remove();

		case 'default':
			$('#MainPageAd2').parents('tr:eq(1)').prev().andSelf().remove();
			$('#MainPageAd1').parents('td:first').prev().andSelf().remove();

			break;

		case 'view':
			$('#ctl00_ContentPlaceHolder1_lb_UserName').parents('tr:eq(1)').nextAll().remove();
			$('#HKGTopGoogleAd').remove();
			$('[id^=MsgInLineAd]').each(function(){ $(this).next('table').andSelf().remove(); });
			$('#HKGBottomGoogleAd').remove();

			break;

		case 'profilepage':
			$('[id*=InLineAd]').each(function(){ $(this).parents('tr:first').remove(); });
			$('#HKGBottomGoogleAd').parents('table:eq(1)').prev().andSelf().remove();
	}
};

/////////////////// END OF - [Rubbish Removal] ///////////////////
/////////////////// START OF - [Initialization] ///////////////////

(function()
{
	if(!AN.done) return setTimeout(arguments.callee, 50);
	AN.removeRubbish();
})();

/////////////////// END OF - [Initialization] ///////////////////