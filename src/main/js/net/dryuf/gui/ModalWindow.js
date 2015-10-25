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

net.dryuf.registerClass("net.dryuf.gui.ModalWindow", null,
{
	constructor:			function(creator, parameters)
	{
		var this_ = this;
		this.element = net.dryuf.gui.GuiDom.createElement("div", { $style: "position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: #eeeeee; border-top: 1px solid #000000; border-left: 1px solid #000000; border-right: 1px solid #000000;" });
		net.dryuf.gui.GuiDom.setText(net.dryuf.gui.GuiDom.addElements(this.element, "a", { href: "#", onclick: function() { this_.close(); } }), "Close");
		net.dryuf.gui.GuiUtil.addGuiElement(this.element);
		alert(this.element.innerHTML);
		return this;
	},
	_$require:			[ "net.dryuf.gui.GuiUtil" ],

	close:				function()
	{
		net.dryuf.gui.GuiDom.removeElement(this.element);
	},
});
