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

net.dryuf.registerClass("net.dryuf.textual.TimeIntervalTextual", "net.dryuf.textual.PreTrimTextual",
{
	constructor:			function()
	{
		return this;
	},

	check:				function(text, style)
	{
		var match;
		if ((match = text.match(/^(((\d+):)?((\d+):))?(\d+)\s*s?$/)) == null)
			return "net.dryuf.textual.TimeIntervalTextual^format HH:MM:SS s required";
		return null;
       	},

	convert:				function(text, style)
	{
		var match;
		if ((match = text.match(/^(((\d+):)?((\d+):))?(\d+)\s*s?$/)) == null)
			throw new Error("invalid format for date, no check performed?");
		return ((match[2] == null ? 0 : match[3]*3600)+(match[4] == null ? 0 : match[5]*60)+match[6]*1)*1000;
	},

	format:					function(internal, style)
	{
		internal /= 1000;
		var sec = internal%60;
		internal = Math.floor(internal/60);
		var min = internal%60;
		internal = Math.floor(internal/60);
		var hour = internal;
		return net.dryuf.sprintf("%d:%02d:%02d s", hour, min, sec);
	},

	convertKey:				function(text)
	{
		return Number(text);
	}
});
