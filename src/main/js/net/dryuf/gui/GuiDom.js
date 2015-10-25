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

(function() { var cls = net.dryuf.registerClass("net.dryuf.gui.GuiDom", null,
{
	constructor:			function()
	{
	},

	_st$createElement:		function(name, attrs)
	{
		if (net.dryuf.is_std) {
			var el = document.createElement(name);
			if (attrs != null)
				net.dryuf.foreachKey(function(v, k) { if (k.match(/^[.$]/)) el.setAttribute(k.substr(1), v); else el[k] = v; }, attrs);
			return el;
		}
		else {
			return net.dryuf.gui.GuiDom.ie_createElement(name, attrs);
		}
	},

	_st$ie_createElement:		function(name, attrs)
	{
		var el = document.createElement(name);
		if (attrs) {
			if ("type" in attrs)
				el.type = attrs.type;
			if ("$class" in attrs)
				el.className = attrs.$class;
			if ("$style" in attrs)
				el.style.cssText = attrs.$style;
		}
		if (attrs != null)
			net.dryuf.foreachKey(function(v, k) { if (k == "type" || k == "$style" || k == "$class") return; else if (k.match(/^$/)) el.setAttribute(k.substr(1), v); else el[k] = v; }, attrs);
		return el;
	},

	_st$addElement:			function(parel, name, attrs /*= null*/)
	{
		/*DBG*/ net.dryuf.assert(typeof parel == "object");
		var el = net.dryuf.gui.GuiDom.createElement(name, attrs);
		parel.appendChild(el);
		return el;
	},

	_st$addElements:		function(parel, elements_csv, attrs)
	{
		var all = elements_csv.split(/,\s*/);
		var last = all.pop();
		net.dryuf.foreach(function(e, i) { parel = net.dryuf.gui.GuiDom.addElement(parel, e); }, all);
		parel = net.dryuf.gui.GuiDom.addElement(parel, last, attrs);
		return parel;
	},

	_st$appendAfter:		function(prev_el, newel)
	{
		if (prev_el.nextSibling)
			prev_el.parentNode.insertBefore(newel, prev_el.nextSibling);
		else
			prev_el.parentNode.appendChild(newel);
	},

	_st$addText:			function(parel, text)
	{
		var node = document.createTextNode(text);
		parel.appendChild(node);
		return node;
	},

	_st$setText:			function(el, text)
	{
		net.dryuf.is_ie ? (el.innerText = text) : (el.textContent = text);
	},

	_st$getText:			function(el)
	{
		return net.dryuf.is_ie ? el.innerText : el.textContent;
	},

	_st$resetElement:		function(parel, element)
	{
		net.dryuf.gui.GuiDom.cleanElement(parel);
		parel.appendChild(element);
	},

	_st$cleanElement:		function(element)
	{
		/*DBG*/net.dryuf.assert(element != null);
		if (!element.childNodes)
			net.dryuf.reportError("element.childNodes undefined");
		while (element.childNodes.length > 0)
			element.removeChild(element.childNodes[0]);
	},

	_st$removeElement:		function(el)
	{
		el.parentNode.removeChild(el);
	},

	_st$templateFromXmlString:	function(parentElement, xmlString, vars)
	{
		var rootElement = net.dryuf.xml.DomUtil.createXml(xmlString).documentElement;
		return cls.templateFromXmlInternal(parentElement, rootElement, vars);
	},

	_st$templateFromXmlInternal:	function(parentElement, node, vars)
	{
		var targetElement = null;
		switch (node.nodeType) {
			case 1: // element
				if (node.namespaceURI == "http://dryuf.org/schema/net/dryuf/web/js/template/") {
					switch (node.localName) {
					case 'text':
						targetElement = cls.addText(parentElement, vars[node.getAttribute("ref")]);
						break;

					default:
						net.dryuf.reportError("unknown dryuf template tagName: "+node.localName);
					}
					break;
				}
				targetElement = cls.addElement(parentElement, node.tagName);
				net.dryuf.foreach(function(attribute) { cls.templateFromXmlInternal(targetElement, attribute, vars); }, node.attributes);
				for (var child = node.firstChild; child; child = child.nextSibling) {
					cls.templateFromXmlInternal(targetElement, child, vars);
				}
				break;

			case 2: // attribute
				if (node.localName.substring(0, 2) == "_.") {
					var name = node.localName.substring(2);
					if (name == "") {
						vars[node.value] = parentElement;
					}
					else {
						parentElement[name] = vars[node.value];
					}
				}
				else {
					parentElement.setAttribute(node.localName, node.value);
				}
				break;

			case 3: // text
				targetElement = cls.addText(parentElement, node.data);

			case 7:
				break;

			default:
				net.dryuf.reportError("invalid element type in template: "+node.nodeType);
		}
		return targetElement;
	},

}); })();
