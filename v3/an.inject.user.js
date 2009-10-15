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
// @run-at document-start
// ==/UserScript==

(function()
{

var kernel = 'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/an.kernel.user.js';
var modules =
[
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/an.ajax.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/an.redesign.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/an.style.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/an.layout.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/an.main.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/an.ui.user.js',
	'http://helianthus-annuus.googlecode.com/svn/tags/v3/LASTEST/an.lib.user.js'
];

var head = document.getElementsByTagName('head');

function addScript(content, addListener)
{
	var script = document.createElement('script');
	script[content.indexOf('http') === 0 ? 'src' : 'text'] = content;
	
	if(addListener) script.onload = script.onreadystatechange = scriptExecuted;
	
	head[0].insertBefore(script, head[0].firstChild);
}

var remain = modules.length;
function scriptExecuted()
{
	if(this.executed || this.readyState && this.readyState != 'loaded' && this.readyState != 'complete') return;
	
	this.executed = true;
	this.onload = this.onreadystatechange = null;
	//head[0].removeChild(this);
	
	if(--remain !== 0) return;
	
	addScript('AN.mod["Scripts Injecter"] = { ver: "3.1.0", author: "向日" };');	
	addScript(kernel);
}

(function appendModules()
{
	if(!head.length) return setTimeout(appendModules, 50);
	
	var i = modules.length;
	while(i--) addScript(modules[i], true);
})();

})();