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
// @name Helianthus.Annuus::Scripts Injector
// @namespace http://code.google.com/p/helianthus-annuus/
// @description by 向日
// @include http://forum*.hkgolden.com/*
// @run-at document-start
// ==/UserScript==

if(/forum\d+\.hkgolden\.com/.test(location.href) && !document.getElementById('helianthus-annuus'))
{
	var script = document.createElement('script');
	script.id = 'helianthus-annuus';
	script.src = '${AN_URL}';

	var head = document.getElementsByTagName('head');
	
	(function()
	{
		head[0] ? head[0].appendChild(script) : setTimeout(arguments.callee, 50);
	})();
}