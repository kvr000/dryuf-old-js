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

(function() { var cls = net.dryuf.registerClass("net.dryuf.datagrid.DepRenderer", "net.dryuf.datagrid.Renderer",
			{
				constructor:			function(processor)
	{
		superc.constructor.apply(this, arguments);
		processor.listPageSize = 0;
	},
	renderList:			function()
	{
		var root = document.createElement("div");
		this.renderListGlobalActions(net.dryuf.gui.GuiDom.addElement(root, "p"));
		this.renderListTable(root);
		return root;
	},

	renderListTable:		function(content_el)
	{
		var processor = this.processor;
		var webMeta = this.webMeta;
		var fields = net.dryuf.filter(function(field) { return !field.isCompos(); }, webMeta.getModeFieldList(processor.mode));
		var cont_table = net.dryuf.gui.GuiDom.addElement(content_el, "table", { $class: "net-dryuf-datagrid-Renderer-list", width: "100%" });
		this.renderListHead(cont_table, fields);
		this.renderListContent(cont_table, fields);
	},
}); var superc = cls.superclass; })();
