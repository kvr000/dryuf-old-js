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

(function() { var cls = net.dryuf.registerClass("net.dryuf.gui.Tab", "net.dryuf.gui.GuiObject",
{
	constructor:			function(owner, position, parameters)
	{
		superc.constructor.apply(this, [ owner, position ]);
		var this_ = this;
		if (parameters.activate == null)
			parameters.activate = 0;
		this.parameters = parameters;
		this.tabs = parameters.tabs;
		this.active = null;
		this.all_tab = net.dryuf.gui.GuiDom.createElement("div", { $style: "width: 100%; height: 100%;" });
		this.choice_tr = net.dryuf.gui.GuiDom.addElements(this.all_tab, "table,tr");
		net.dryuf.foreach(function (tab, i) { net.dryuf.gui.GuiDom.setText(tab.head = net.dryuf.gui.GuiDom.addElements(this_.choice_tr, "th,a", { this_: this_, idx: i, tab: tab, href: '#', onclick: function() { if (this.tab.handler) this.tab.handler(); else this.this_.handleChoose(this.tab); return false; } }), net.dryuf.tlocalize(tab.name)); }, this.tabs);
		net.dryuf.gui.GuiDom.resetElement(this.position, this.all_tab);
		this.handleChoose(this.tabs[0]);
		return this;
	},


	createCloseButton:		function(handler)
	{
		return { name: net.dryuf.clocalize(cls, "✖"), handler: handler, width: "100%", creator: function(manager, position) { this.manager = manager; return new net.dryuf.gui.GuiObject(manager, position); } };
	},

	handleChoose:			function(tab)
	{
		this.activateTab(tab);
	},

	activateTab:			function(tab)
	{
		/*DBG*/net.dryuf.assert(tab);
		if (this.active != null) {
			this.active.content.style.display = "none";
		}
		if (!tab.content) {
			tab.content = net.dryuf.gui.GuiDom.addElement(this.all_tab, "div");
			if (this.parameters.scrolled != null) {
				tab.content.style.height = this.parameters.scrolled;
				tab.content.style.overflow = "auto";
			}
			this.showingTab(tab);
			if (typeof tab.creator != 'function')
				net.dryuf.reportError("no tab.creator: "+net.dryuf.core.Dump.dumpContent(tab, 2));
			tab.gui_obj = tab.creator(this, tab.content);
		}
		else {
			this.showingTab(tab);
		}
	},

	showingTab:			function(tab)
	{
		tab.content.style.display = "block";
		this.active = tab;
		if (tab.activator)
			tab.activator(tab, tab.content);
	},

	destroyTabContent:		function(tab)
	{
		if (this.active == tab)
			this.active = null;
		net.dryuf.assert(tab.gui_obj);
		tab.gui_obj.close();
		net.dryuf.gui.GuiDom.removeElement(tab.content);
		tab.content = null;
	},

	openDynamic:			function(parameters, creator)
	{
	},

	closeDynamic:			function(obj)
	{
	},

	setTabEnabled:			function(tab, enabled)
	{
		tab.head.style.display = enabled ? 'block' : 'none';
	},
}); var superc = cls.superclass; })();
