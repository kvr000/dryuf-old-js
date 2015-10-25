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

net.dryuf.registerClass("net.dryuf.gui.Form", "net.dryuf.gui.GuiObject",
{
	constructor:			function(owner, position, parameters)
	{
		return this;
	},

	_st$submitExistingAsync:	function(method, form)
	{
		if (form.ontheway)
			return;

		tmpname = net.dryuf.genUniqueId();

		if (method != "GET" && method != "POST") {
			net.dryuf.gui.GuiDom.addElement(form, "input", { name: "_method", type: "hidden", value: method });
			//method = "POST";
		}
		form.method = method;
		form.enctype = "multipart/form-data";
		form.target = tmpname;

		var data = new FormData(form);
		net.dryuf.core.Ajax.runMultipart(
				form.action,
				data,
				form.oncompleted
				);
	},
});
