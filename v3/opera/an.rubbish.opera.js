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
// @name Helianthus.Annuus 3: Rubbish Remover
// @namespace http://code.google.com/p/helianthus-annuus/
// @description by 向日
// @include http://forum*.hkgolden.com/*
// @run-at document-start
// ==/UserScript==

(function()
{

var window = (typeof unsafeWindow != 'undefined') ? unsafeWindow : (typeof contentWindow != 'undefined') ? contentWindow : this;
var AN = window.AN || (window.AN = { temp: [], mod: {} });

if(AN.initialized) return; // for Chrome which interestingly executes user scripts even when injecting xhr HTML into an element

AN.mod['Rubbish Remover'] = { ver: '3.0.0', author: '向日' };

var blockScripts = function(event)
{
	if(/pixelinteractivemedia|imrworldwide|google-analytics|_getTracker|\(ads|InlineAd|PageAd|GoogleAd|google_ad/.test(event.element.text) || /pagead|imrworldwide/.test(event.element.src))
	{
		if(!/common.js$/.test(event.element.src))
		{
			event.preventDefault();
		}
	}
};

window.opera.addEventListener('BeforeScript', blockScripts, false);
window.addEventListener('DOMContentLoaded', function()
{
	window.opera.removeEventListener('BeforeScript', blockScripts, false);
}, false);

})(); // end anonymous