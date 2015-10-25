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

(function() { var cls = net.dryuf.registerClass("net.dryuf.datagrid.ChildRenderer", "net.dryuf.datagrid.Renderer",
{
	constructor:			function(processor)
	{
		superc.constructor.apply(this, arguments);
		processor.listPageSize = 0;
	},

	renderList:			function()
	{
		var this_ = this;
		var root = net.dryuf.gui.GuiDom.createElement("div", { $class: this.getCssClasses(null) });
		var main_table = net.dryuf.gui.GuiDom.addElement(root, "table", { $class: "list", width: "100%", border: 0, cellspacing: 2 });
		this.renderGuiHead(main_table);
		if (this.processor.owner.mode == 'edit') {
			this.renderListGlobalActions(net.dryuf.gui.GuiDom.addElements(main_table, "tr,td"));
		}

		var rows = net.dryuf.gui.GuiDom.addElements(main_table, "tr,td");
		this.renderListTable(rows);
		return root;
	},

	renderListTable:		function(content_el)
	{
		var processor = this.processor;
		var webMeta = this.webMeta;
		var fields = net.dryuf.filter(function(field) { return field.getAssocType() != net.dryuf.meta.WebFieldImpl.AST_Compos; }, this.expandAllFields(processor.mode));
		var cont_table = net.dryuf.gui.GuiDom.addElement(content_el, "table", { $class: "rows", width: "100%" });
		this.renderListHead(cont_table, fields);
		this.renderListContent(cont_table, fields);
	},

	renderListHead:			function(cont_table, fields)
	{
		var processor = this.processor;
		var cont_head = net.dryuf.gui.GuiDom.addElement(cont_table, "tr", { $class: "header" });
		if (processor.owner.mode == 'edit')
			net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(cont_head, "th", { $class: "action" }), net.dryuf.clocalize(cls.superclassClass, "Action"));
		net.dryuf.foreach(function(field) { if (field.display != "hidden") net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElement(cont_head, "th", { $class: "field" }), net.dryuf.localize(processor.dataClassName, field.text != null ? field.text : field.name)); }, fields);
	},

	renderListObjectActions:	function(row_tr, objKey, obj, i)
	{
		if (this.processor.owner.mode == 'edit') {
			superc.renderListObjectActions.apply(this, arguments);
		}
	},
}); var superc = cls.superclass; })();
