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

net.dryuf.registerClass("net.dryuf.textual.ColorTextual", "net.dryuf.textual.PreTrimTextual",
{
	constructor:			function() { return this; },
	check:				function(text, style)
	{
		var match;
		if ((match = text.match(/^(#([0-9a-f]{3})|#([0-9a-f]{6}))$/)) == null)
			return "net.dryuf.textual.ColorTextual^format #RGB or #RRGGBB required";
		return null;
       	},

	convert:				function(text, style)
	{
		var match;
		if ((match = text.match(/^(#([0-9a-f]{3})|#([0-9a-f]{6}))$/)) == null)
			throw new Error("net.dryuf.textual.ColorTextual^invalid format for date, no check performed?");
		if (match[2] != null)
			return Number("0x"+match[2].replace(/(\d)/g, '$1f'));
		else
			return Number("0x"+match[3]);
	},

	format:					function(internal, style)
	{
		return net.dryuf.sprintf("#%06x", internal);
	},

	convertKey:				function(text)
	{
		return Number(text);
	},
});
