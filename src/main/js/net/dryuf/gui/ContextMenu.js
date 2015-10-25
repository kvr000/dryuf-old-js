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

net.dryuf.registerClass("net.dryuf.gui.ContextMenu", null,
{
	constructor:			function(ev, title, items)
	{
		var this_ = this;
		this.title = title;
		this.items = items;
		var el;
		net.dryuf.gui.ContextMenu.hide();
		this.z_index = net.dryuf.gui.GuiUtil.advZIndex();
		el = net.dryuf.gui.GuiDom.createElement("div", {
			oldmousedown:		document.onmousedown,
			onmouseover:		function() { this.mouseOut = false; },
			onmouseout:		function() { this.mouseOut = true; },
			mouseOut:		true,
			id:			"net.dryuf.gui.ContextMenu.element",
			$class:			"net-dryuf-gui-ContextMenu",
			$style:			"position: absolute; z-index: "+this.z_index+"",
		});
		var ul = net.dryuf.gui.GuiDom.addElement(el, "ul", { $class: "list" });
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(ul, "li", { $class: 'title' }), this.title);
		net.dryuf.foreach(function (i) {
			net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(ul, "li,a", { href: '#', action: i, onclick: function() { this_.runAction(this); return false; } }), i.text);
		}, items);
		var pos = net.dryuf.gui.GuiUtil.getDocumentEventPos(ev);
		net.dryuf.gui.GuiUtil.addGuiElement(el);
		net.dryuf.gui.GuiUtil.placeElementAtPos(el, pos);
		document.onmousedown = function() { if (document.getElementById("net.dryuf.gui.ContextMenu.element").mouseOut) net.dryuf.gui.ContextMenu.hide(); return false; };
		return this;
	},
	_$require:			[ "net.dryuf.gui.GuiUtil" ],
	_$css:				[ "net/dryuf/gui/ContextMenu.css" ],

	_st$staticInit:			function()
	{
		document.oncontextmenu = net.dryuf.gui.ContextMenu.onContext;
		if (net.dryuf.agent == 'khtml' || net.dryuf.agent == 'opera') {
			document.onmousedown = function(ev) { if (ev.button == 2) return net.dryuf.gui.ContextMenu.onContext(ev); };
		}
		else if (net.dryuf.agent == 'msie') {
			document.onmousedown = function(ev) { ev = net.dryuf.gui.GuiUtil.getEvent(ev); if (ev.button == 2) return net.dryuf.gui.ContextMenu.onContext(ev); };
		}
	},

	_st$onContext:			function(ev)
	{
		ev = net.dryuf.gui.GuiUtil.getEvent(ev);
		for (var target = ev.target; target; target = target.parentNode) {
			if ("popupMenu" in target) {
				/*var ret =*/ target.popupMenu(ev);
				if (net.dryuf.is_ie)
					ev.returnValue = false;
				return false;
			}
		}
		return true;
	},

	_st$hide:			function()
	{
		var el = document.getElementById("net.dryuf.gui.ContextMenu.element");
		if (el) {
			document.onmousedown = el.oldmousedown;
			net.dryuf.gui.GuiDom.removeElement(el);
		}
	},

	runAction:			function(el)
	{
		var action = el.action;
		net.dryuf.gui.ContextMenu.hide();
		action.handler();
	},
});
