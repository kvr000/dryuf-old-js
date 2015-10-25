/*
 * Dryuf framework
 *
 * ----------------------------------------------------------------------------------
 *
 * Copyright (C) 2002-2015 Zbyněk Vyškovský
 *
 * ----------------------------------------------------------------------------------
 *
 * LICENSE:
 *
 * This file is part of Dryuf
 *
 * Dryuf is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 3 of the License, or (at your option)
 * any later version.
 *
 * Dryuf is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for
 * more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Dryuf; if not, write to the Free Software Foundation, Inc., 51
 * Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @author	2002-2015 Zbyněk Vyškovský
 * @link	mailto:kvr@matfyz.cz
 * @link	http://kvr.matfyz.cz/software/java/dryuf/
 * @link	http://github.com/dryuf/
 * @license	http://www.gnu.org/licenses/lgpl.txt GNU Lesser General Public License v3
 */

(function() { var cls = net.dryuf.registerClass("net.dryuf.xml.DomUtil", null,
{
	constructor:			function()
	{
	},

	_st$createXml:			function(content)
	{
		var xml;
		try {
			xml = new DOMParser();
		}
		catch (e) {
			xml = new ActiveXObject("Microsoft.XMLDOM");
			xml.loadXML(content);
			return xml;
		}
		return xml.parseFromString(content, "text/xml");
	},

	_st$escapeXml:			function(s)
	{
		s = s.toString();
		s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;');
		return s;
	},

	_st$getImmediateElementsByTag:	function(parentElement, name)
	{
		net.dryuf.assert(parentElement);
		net.dryuf.assert(parentElement.childNodes);
		var result = [];
		net.dryuf.foreach(
			function(child) {
				if (child.nodeType == 1 && child.tagName == name)
					result.push(child);
			},
			parentElement.childNodes
		);
		return result;
	},

	_st$getMandatoryElement:	function(parentElement, name)
	{
		var list = parentElement.getElementsByTagName(name);
		switch (list.length) {
		case 0:
			throw Error("element "+name+" not found in xml");

		case 1:
			return list[0];

		default:
			throw Error("expected only one element of name "+name+", got "+list.length);
		}
	},

	_st$getOptionalElement:		function(parentElement, name)
	{
		var list = cls.getImmediateElementsByTag(parentElement, name);
		switch (list.length) {
		case 0:
			return null;

		case 1:
			return list[0];

		default:
			throw Error("expected only one element of name "+name);
		}
	},

	_st$getSubElements:		function(parentElement, main, sub)
	{
		var mainElement;
		if (!(mainElement = cls.getOptionalElement(parentElement, main)))
			return [];
		var subElements = cls.getImmediateElementsByTag(mainElement, sub);
		return subElements;
	},

	/**
	 * Converts attributes from DOM element to a hash.
	 */
	_st$hashElementAttrs:		function(el)
	{
		net.dryuf.assert(el);
		return net.dryuf.hashMap(function (ela) { return [ ela.name, ela.value ]; }, el.attributes);
	},

}); })();
