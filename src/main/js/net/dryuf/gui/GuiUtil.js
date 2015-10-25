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

(function() { var cls = net.dryuf.registerClass("net.dryuf.gui.GuiUtil", null,
{
	constructor:			function()
	{
		return this;
	},

	_st$getDocumentEventPos:		function(ev)
	{
		ev = cls.getEvent(ev);
		var x = ev.clientX, y = ev.clientY;
		if (typeof(window.pageYOffset) == 'number') {
                        x += window.pageXOffset;
                        y += window.pageYOffset;
                }
		else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                        x += document.documentElement.scrollLeft;
                        y += document.documentElement.scrollTop;
                }
		else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                        x += document.body.scrollLeft;
                        y += document.body.scrollTop;
                }

		return [ x, y ];
	},

	_st$getEvent:				function(ev_arg)
	{
		if (!ev_arg)
			ev_arg = window.event;
		if (!ev_arg.target && ev_arg.srcElement)
			ev_arg.target = ev_arg.srcElement;
		return ev_arg;
	},

	_st$addGuiElement:			function(el)
	{
		(document.getElementsByTagName("body"))[0].appendChild(el);
	},

	_st$advZIndex:				function()
	{
		if (cls.cur_z == null)
			cls.cur_z = 1024;
		return ++cls.cur_z;
	},

	_st$releaseZIndex:			function(idx)
	{
		--cls.cur_z;
	},

	_st$getDocumentElementPos:		function(el)
	{
		var left = 0, top = 0;
		var x = el.offsetLeft;
		do {
			left += el.offsetLeft-el.scrollLeft;
			top += el.offsetTop-el.scrollTop;
		} while (el = el.offsetParent);
		if (net.dryuf.is_ie)
			return [ x, top ];
		else
			return [ left, top ];
	},

	_st$getElementSize:			function(el)
	{
		return [ el.offsetWidth, el.offsetHeight ];
	},

	_st$getWindowSize:			function()
	{
		return [ window.innerWidth, window.innerHeight ];
	},

	_st$placeElementAtPos:			function(el, pos)
	{
		el.style.left = pos[0]+"px";
		el.style.top = pos[1]+"px";
		setTimeout(function() {
				var size = net.dryuf.gui.GuiUtil.getElementSize(el);
				var wind = net.dryuf.gui.GuiUtil.getWindowSize();
				if (pos[0]+size[0] >= wind[0])
					el.style.left = pos[0]-size[0]-5+"px";
				if (pos[1]+size[1] >= wind[1])
					el.style.top = pos[1]-size[1] > 0 ? pos[1]-size[1]-5+"px" : 0;
			}, 0);
	},
}); })();
