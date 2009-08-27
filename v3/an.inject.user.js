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
// @name Helianthus.Annuus 3: Scripts Injecter
// @namespace http://code.google.com/p/helianthus-annuus/
// @description by 向日
// @include http://forum*.hkgolden.com/*
// ==/UserScript==

(function()
{

var aScripts =
[
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/user/an.kernel.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/user/an.ajax.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/user/an.redesign.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/user/an.style.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/user/an.layout.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/user/an.main.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/user/an.ui.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/user/an.lib.user.js'
];

var i = aScripts.length;
while(i--)
{
	var eScript = document.createElement('script');
	eScript.type = 'text/javascript';
	eScript.src = aScripts[i];
	document.getElementsByTagName('head')[0].appendChild(eScript);
}

})();