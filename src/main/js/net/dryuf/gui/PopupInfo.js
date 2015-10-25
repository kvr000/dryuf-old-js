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

(function() { var cls = net.dryuf.registerClass("net.dryuf.gui.PopupInfo", "net.dryuf.gui.GuiObject",
{
	constructor:			function(ev, options)
	{
		this.z_index = net.dryuf.gui.GuiUtil.advZIndex();
		superc.constructor.apply(this, [ null, net.dryuf.gui.GuiDom.createElement("div", {
				$class:			"net-dryuf-gui-PopupInfo",
				$style:			"position: absolute; z-index: "+this.z_index+";",
			}), {} ]);
		if (options.content)
			this.position.appendChild(options.content);
		var pos = net.dryuf.gui.GuiUtil.getDocumentEventPos(ev);
		if (options.shift) {
			pos[0] += options.shift;
			pos[1] += options.shift;
		}
		net.dryuf.gui.GuiUtil.addGuiElement(this.position);
		net.dryuf.gui.GuiUtil.placeElementAtPos(this.position, pos);
		if (options.timeout)
			setTimeout(net.dryuf.bindThis(this, this.close), options.timeout);
		return this;
	},
	_$require:			[ "net.dryuf.gui.GuiUtil" ],
	_$css:				[ "net/dryuf/gui/PopupInfo.css" ],

	close:				function()
	{
		if (!this.is_closed) {
			this.is_closed = 1;
			net.dryuf.gui.GuiDom.removeElement(this.position);
			net.dryuf.gui.GuiUtil.releaseZIndex(this.z_index);
			superc.close.apply(this, []);
		}
	},
}); var superc = cls.superclass; })();
